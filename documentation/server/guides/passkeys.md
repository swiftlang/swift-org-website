---
layout: new-layouts/base
title: Going passwordless with Passkeys
---

In this tutorial we will explore Passkeys. To be more specific, we'll explore how we can integrate the [Swift WebAuthn library](https://github.com/swift-server/webauthn-swift) into a server-side Swift app. The process of registering and authenticating using Passkeys is pretty simple, but requires some back and forth between client and server. Therefore this tutorial is split into two separate parts: Passkey registration and Passkey authentication.

To avoid starting completely from scratch and turning this blog article into a whole book, I prepared a small starter project which you can [download here](https://github.com/brokenhandsio/swift-webauthn-guide).

Today I'll show you an example implementation for a standalone Passkey login, however it is also possible to integrate webauthn-swift along an existing, password-based, login, for hardware based 2FA.

What are Passkeys? Others already did a good job at explaining this, so why reinvent the wheel? Here is a quote from [passkeys.com](https://passkeys.com):

> Passkeys are the new standard to authenticate on the web.
> Passkeys are a safer and easier replacement for passwords. With passkeys, users can sign in to apps and websites with a biometric sensor (such as a fingerprint or facial recognition), PIN, or pattern, freeing them from having to remember and manage passwords.

To read more about Passkeys and how they work I recommend the following two resources:

- Introduction: [https://webauthn.guide](https://webauthn.guide/)
- Details: [https://w3c.github.io/webauthn](https://w3c.github.io/webauthn/)
- Apple Developer Documentation: [https://developer.apple.com/passkeys](https://developer.apple.com/passkeys/)

## Fundamentals

Passkeys are integrated into our browsers, which expose a JavaScript API that can be used to trigger the Passkey prompts.

*Safari Passkey prompt:*
![Screenshot of Safari browser prompting for a Passkey](/assets/images/server-guides/safari_passkey_prompt.png)


*Another example - 1Password prompt:*
![Screenshot of Safari browser prompting for a Passkey through the 1Password extension](/assets/images/server-guides/1password_passkey_prompt.png)

These two prompts are the result of calling `navigator.credentials.create(...)` and `navigator.credentials.get(...)`.

To get a better understanding let's quickly play around with this API. Open [Swift.org](https://swift.org) in a new tab, open the developer panel of your browser and switch to the JavaScript console. Create the following variable:

```js
const publicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from(
        "randomStringFromServer", c => c.charCodeAt(0)),
    rp: {
        name: "Swift",
        id: "swift.org",
    },
    user: {
        id: Uint8Array.from(
            "UZSL85T9AFC", c => c.charCodeAt(0)),
        name: "me@example.com",
        displayName: "FooBar",
    },
    pubKeyCredParams: [{alg: -7, type: "public-key"}],
    authenticatorSelection: {
        authenticatorAttachment: "cross-platform",
    },
    timeout: 60000,
    attestation: "direct"
};
```

Don't worry, you don't have to understand the content. In fact the Swift WebAuthn library will create this for you automatically. Now calling the Passkeys API with our newly created `publicKeyCredentialCreationOptions` will prompt you to create a new Passkey:

```js
const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions
});
```

## Act 1 - Setup

### Setting up the Relying Party

If you haven't already downloaded the [demo project](https://github.com/brokenhandsio/swift-webauthn-guide), you should do so now. There's a `starter` and `final` project. Open the starter project and add the Swift WebAuthn library to your `Package.swift`:

```swift
dependencies: [
    // ...
    .package(url: "https://github.com/swift-server/webauthn-swift.git", from: "1.0.0-alpha")
],

// ...

targets: [
    .target(
        name: "App",
        dependencies: [
            // ...
            .product(name: "WebAuthn", package: "webauthn-swift")
// ...
]
```

First, you need to create an instance of `WebAuthnManager`, the core of the Swift WebAuthn library. The WebAuthn library works with any server-side Swift framework, but we'll use Vapor for this tutorial. With Vapor, you could extend `Request` with a `webAuthn` property which allows us to easily access it in the route handlers. Add this in a new file called `Request+webAuthn.swift`:

```swift
import Vapor
import WebAuthn

extension Request {
    var webAuthn: WebAuthnManager {
        WebAuthnManager(
            config: WebAuthnManager.Config(
                // 1
                relyingPartyID: "localhost",
                // 2
                relyingPartyName: "Vapor Passkey Tutorial",
                // 3
                relyingPartyOrigin: "http://localhost:8080"
            )
        )
    }
}
```

Here we configure 3 things:
1. The `relyingPartyID` identifies your app based solely on the domain (not the scheme, port, or path) it can be accessed on. All created Passkeys will be scoped to this identifier. That means a Passkey created at `example.org` can only be used on the same domain. Specifying a subdomain like `auth.example.org` will also allow Passkeys from e.g. `dev.auth.example.org`, but not `login.example.org`. This prevents other websites from talking to random Passkeys. However this also means if you want to change your domain at some point all users need to re-create their Passkeys!
2. The `relyingPartyName` is just a friendly name shown to the user when registering or logging in.
3. The `relyingPartyOrigin` works similar to the relying party id, but [serves as an additional layer of protection](https://w3c.github.io/webauthn/#sctn-validating-origin). Here we need to specify the whole origin. In our case it's the scheme `https://` + the relying party id + the port `:8080`

🚨 It is important that you run your app on `localhost` and not on `127.0.0.1` since _some_ WebAuthn browser implementations, password managers and authenticators only work with "valid" domains. With Vapor you can achieve this by using `--hostname localhost`:
```bash
swift run App serve --hostname localhost
```

Great, that's everything we need to get started.


## Act 2 - Registration

From the UI perspective we only need three components: Two buttons and a text field for entering a username! No password field needed... that's why we're here after all! Let's start with building a quick registration form in HTML. Insert the following form into `Resources/Views/index.leaf` just after `<!-- Form -->`:

```html
<form id="registerForm">
    <input id="username" type="text" />
    <button type="submit">Register</button>
</form>
```

The app should now return you a blank HTML form at http://localhost:8080/.


### Planning ahead

Before we jump into the business logic let's write down what we need:
1. When a user clicks the "Register" button we will notify our server about a new registration attempt.
2. The server will put together a few pieces of information and send these back to the client (the browser).
3. The client will take this information and pass it into the `create(parseCreationOptionsFromJSON(...))` JavaScript function which will trigger the Passkey prompt. The returned value of this function is our brand new Passkey! Great!
4. Finally we send our new Passkey back to the server, verify it and persist it in a database.

It sounds like a lot of work, but it's actually pretty simple.

### Bringing `<form>` to life

Alright let's start with step one. Add this after the closing `</form>` tag from the previous step:

```html
<script type="module">
  // import WebAuthn wrapper
  import { create, parseCreationOptionsFromJSON } from 'https://cdn.jsdelivr.net/npm/@github/webauthn-json@2.1.1/dist/esm/webauthn-json.browser-ponyfill.js';

  // Get a reference to our registration form
  const registerForm = document.getElementById("registerForm");

  // Listen for the form's "submit" event
  registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get the username
    const username = document.getElementById("username").value;

    // Send request to server
    const registerResponse = await fetch('/register?username=' + username);

    // Parse response as json and pass into wrapped WebAuthn API
    const registerResponseJSON = await registerResponse.json();
    const passkey = await create(parseCreationOptionsFromJSON(registerResponseJSON));
  });
</script>
```

First we add a third-party script developed by GitHub which adds user-friendly wrappers on top of the original WebAuthn APIs `navigator.credentials.create` and `navigator.credentials.get`. This is just for convenience and not mandatory! If you don't want to use it you'll have to deserialise some of the `registrationOptions` properties since the original API expects a few "raw" byte arrays. Using the wrapper we can simply pass in the JSON response from our server — neat! The official WebAuthn API will [support this out of the box at some point](https://w3c.github.io/webauthn/#sctn-parseCreationOptionsFromJSON), but for now we depend on GitHub's "webauthn-json" library.

Our script will listen for the form's `submit` event. On submit it sends a `/register` request to our backend and passes the JSON response to `create(parseCreationOptionsFromJSON(...))` thus triggering the browsers Passkey prompt.

If the user successfully responds to the prompt we'll get a brand new passkey in `const passkey`. Later we will send this passkey to our server and verify it. On the server side of things we still need to add the endpoint we just called in the JavaScript code. In a Vapor app you'd have to register a new route in `routes.swift`:

```swift
app.get("register") { req in
    // Create and login user
    let username = try req.query.get(String.self, at: "username")
    let user = User(username: username)
    try await user.create(on: req.db)
    req.auth.login(user)

    // Generate registration options
    let options = req.webAuthn.beginRegistration(user:
        .init(
            id: try [UInt8](user.requireID().uuidString.utf8),
            name: user.username,
            displayName: user.username
        )
    )

    // Also pass along challenge because we need it later
    req.session.data["registrationChallenge"] = Data(options.challenge).base64EncodedString()

    return CreateCredentialOptions(publicKey: options)
}
```

On `/register` this creates a new user and calls the `beginRegistration` function with the newly created user. This will give us a set of options which we send back to the client. Additionally we store the challenge in a cookie because we'll need it later when verifying the new Passkey. If you inspect the returned options you'll notice that these are the options you manually entered in your browser's JavaScript console at the beginning of this blog post!

The WebAuthn API expects the options inside a property named `publicKey`. That's why we return an instance of `CreateCredentialOptions` — a type which doesn't exist yet. So let's create and conform it to `AsyncResponseEncodable` so we can easily return it an a Vapor route handler:

```swift
struct CreateCredentialOptions: Encodable, AsyncResponseEncodable {
    let publicKey: PublicKeyCredentialCreationOptions

    func encodeResponse(for request: Request) async throws -> Response {
        var headers = HTTPHeaders()
        headers.contentType = .json
        return try Response(status: .ok, headers: headers, body: .init(data: JSONEncoder().encode(self)))
    }
}
```

Time to give it a try: Entering a username and clicking "Register" should trigger the prompt asking you to create a new Passkey! However nothing will happen afterwards. Let's fix that!

### Verifying and persisting the Passkey

After the browser creates the Passkey we need to send it to our server, verify everything went smoothly and persist it somewhere.

First, let's send the Passkey to our server. In our JavaScript code add this just below `const passkey = await create(parseCreationOptionsFromJSON(registerResponseJSON));` in the `registerForm` event listener:

```js
const createPasskeyResponse = await fetch('/passkeys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(passkey)
});
```

On the server we first obtain the user we want to register a Passkey for. Then we decode the Passkey from the request body and verify it. If everything went well we can persist the Passkey in our database. Add this logic in a new `POST /register` endpoint:

```swift
// Example implementation for a Vapor app
app.post("register", use: { req in
    // Obtain the user we're registering a credential for
    let user = try req.auth.require(User.self)

    // Obtain the challenge we stored for this session
    guard let challengeEncoded = req.session.data["registrationChallenge"],
        let challenge = Data(base64Encoded: challengeEncoded) else {
        throw Abort(.badRequest, reason: "Missing registration challenge")
    }

    // Delete the challenge to prevent attackers from reusing it
    req.session.data["registrationChallenge"] = nil

    // Verify the credential the client sent us
    let credential = try await req.webAuthn.finishRegistration(
        challenge: [UInt8](challenge),
        credentialCreationData: req.content.decode(RegistrationCredential.self),
        confirmCredentialIDNotRegisteredYet: { _ in true}
    )

    try await Passkey(
        id: credential.id,
        publicKey: credential.publicKey.base64URLEncodedString().asString(),
        currentSignCount: credential.signCount,
        userID: user.requireID()
    ).save(on: req.db)

    return HTTPStatus.ok
})
```

Congratulations, you just built a Passkey registration! Entering a username and hitting "Register" should now redirect you to a private page. The passkey should also appear in your database (in the passkeys table) now.

## Act 2 - Log in

Now that we have a Passkey we can use it to log in. The process is very similar to the registration process, except we don't need an input field for the username.
Let's start with the frontend. Add a new HTML form below the registration in `Resources/Views/index.leaf`:

```html
</form>
<!-- End of registration form -->

<form id="loginForm">
    <button type="submit">Login</button>
</form>
```

Next we need to import two additional helper from the GitHub WebAuthn wrapper. Update the import statement in the `<script>` tag to include `get` and `parseRequestOptionsFromJSON`:

```js
import { create, get, parseCreationOptionsFromJSON, parseRequestOptionsFromJSON } from 'https://cdn.jsdelivr.net.....
```

At the end of the script add the following code:
```js
// ...
//     location.href = "/private";
// });

// Get a reference to our login form
const loginForm = document.getElementById("loginForm");

// Listen for the form's "submit" event
loginForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  // Send request to Vapor app
  const loginResponse = await fetch('/login');
  // Parse response as json and pass into wrapped WebAuthn API
  const loginResponseJSON = await loginResponse.json();
  const loginAttempt = await get(parseRequestOptionsFromJSON(loginResponseJSON));
});
```

Similar to the registration we listen for the form's `submit` event. On submit we send a `/login` request to our backend. The response contains a handful of options and a randomly generated challenge. When passing this data to `get(parseRequestOptionsFromJSON(...))` the browser will prompt the user to log in using a Passkey. On success the challenge will be signed by the Passkey. This signed challenge is what we send back to the server in a second request. Add this just after `const loginAttempt = await get(parseRequestOptionsFromJSON(loginResponseJSON));`:

```js
// Send passkey to Vapor app
const loginAttemptResponse = await fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginAttempt)
});

// Redirect to private page
location.href = "/private";
```

This will send the login attempt with the signed challenge to our server and redirect the user to the private page if everything went well. Let's implement the server side of things. First add the endpoint that handles the `GET /login` request returning the options and a randomly generated challenge:

```swift
app.get("login") { req in
    // Generate registration options
    let options = try req.webAuthn.beginAuthentication()
    // Also pass along challenge because we need it later
    req.session.data["authChallenge"] = Data(options.challenge).base64EncodedString()
    return RequestCredentialOptions(publicKey: options)
}
```

Additionally we store the challenge in a cookie because we'll need it later when verifying the Passkey. Running the server and pressing "Login" should now trigger the Passkey prompt. If you previously registered it should also show you the username (or a list of usernames if you registered more than one account). However if you try to confirm the prompt you'll notice that nothing happens.

The last step will be to verify login attempts in the `POST /login` endpoint. Start by adding the endpoint and retrieving the challenge from the users session:

```swift
app.post("login") { req in
    // Obtain the challenge we stored on the server for this session
    guard let challengeEncoded = req.session.data["authChallenge"],
        let challenge = Data(base64Encoded: challengeEncoded) else {
        throw Abort(.badRequest, reason: "Missing authentication challenge")
    }

    req.session.data["authChallenge"] = nil
}
```

To prevent attackers from reusing the challenge, using a so-called [Replay attack](https://en.wikipedia.org/wiki/Replay_attack), we delete it from the session right away. To verify the login attempt we first decode it from the request body and try to find the corresponding Passkey in our database. If we find a Passkey we can continue and verify the login attempt. Add this below `req.session.data["authChallenge"] = nil`:

```swift
let authenticationCredential = try req.content.decode(AuthenticationCredential.self)

guard let credential = try await Passkey.query(on: req.db)
    .filter(\.$id == authenticationCredential.id.urlDecoded.asString())
    .with(\.$user)
    .first() else {
    throw Abort(.unauthorized)
}

let verifiedAuthentication = try req.webAuthn.finishAuthentication(
    credential: authenticationCredential,
    expectedChallenge: [UInt8](challenge),
    credentialPublicKey: [UInt8](URLEncodedBase64(credential.publicKey).urlDecoded.decoded!),
    credentialCurrentSignCount: credential.currentSignCount
)
```

Finally if `webAuthn.finishAuthentication` returns without throwing an error we know the login attempt was successful. We can now update the Passkey's `currentSignCount`, sign in the user and return a response just after the call to `req.webAuthn.finishAuthentication`:

```swift
credential.currentSignCount = verifiedAuthentication.newSignCount
try await credential.save(on: req.db)

req.auth.login(credential.user)
return HTTPStatus.ok
```

Congratulations, you just built a Passkey login! Pressing the login button and confirming the Passkey prompt should redirect you to a private page. If you want to see the whole implementation you can find it in the "final" directory of the [demo project](https://github.com/brokenhandsio/swift-webauthn-guide).
