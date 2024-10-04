---
redirect_from: "server/guides/libraries/log-levels"
layout: new-layouts/base
title: Log Levels
---

This guide serves as guidelines for library authors with regard to what [SwiftLog](https://github.com/apple/swift-log) log levels are appropriate for use in libraries, and in what situations to use what level.

Libraries need to be well-behaved across various use cases, and cannot assume a specific style of logging backend will be used with them. It is up to developers implementing specific applications and systems to configure those specifics of their application, and some may choose to log to disk, some to memory, or some may employ sophisticated log aggregators. In all those cases a library should behave "well", meaning that it should not overwhelm typical ("stdout") log backends by logging too much, alerting too much by over-using `error` level log statements etc.

This is aimed for library authors with regards to what [SwiftLog](https://github.com/apple/swift-log) log levels are appropriate for use in libraries, and also general logging style hints.

## Guidelines for Libraries

SwiftLog defines the following 7 log levels via the [`Logger.Level` enum](https://apple.github.io/swift-log/docs/current/Logging/Structs/Logger/Level.html), ordered from least to most severe:

* `trace`
* `debug`
* `info`
* `notice`
* `warning`
* `error`
* `critical`

Out of those, only levels _less severe than_ info (exclusively) are generally okay to be used by libraries.

In the following section we'll explore how to use them in practice.

### Recommended log levels

It is always fine for a library to log at `trace` and `debug` levels, and these two should be the primary levels any library is logging at.

`trace` is the finest log level, and end-users of a library will not usually use it unless debugging very specific issues. You should consider it as a way for library developers to "log everything we could possibly need to diagnose a hard to reproduce bug."  Unrestricted logging at `trace` level may take a toll on the performance of a system, and developers can assume trace level logging will not be used in production deployments, unless enabled specifically to locate some specific issue.

This is in contrast with `debug` which some users _may_ choose to run enabled on their production systems.

> Debug level logging should be not "too" noisy. Developers should assume some production deployments may need to (or want to) run with debug level logging enabled.
>
> Debug level logging should not completely undermine the performance of a production system.

As such, `debug` logging should provide a high value understanding of what is going on in the library for end users, using domain relevant language.  Logging at `debug` level should not be overly noisy or dive deep into internals; this is what `trace` is intended for.

Use `warning` level sparingly. Whenever possible, try to rather return or throw `Error` to end users that are descriptive enough so they can inspect, log them and figure out the issue. Potentially, they may then enable debug logging to find out more about the issue.

It is okay to log a `warning` "once", for example on system startup. This may include some one off "more secure configuration is available, try upgrading to it!" log statement upon a server's startup. You may also log warnings from background processes, which otherwise have no other means of informing the end user about some issue.

Logging on `error` level is similar to warnings: prefer to avoid doing so whenever possible. Instead, report errors via your library's API. For example, it is _not_ a good idea to log "connection failed" from an HTTP client. Perhaps the end-user intended to make this request to a known offline server to _confirm_ it is offline? From their perspective, this connection error is not a "real" error, it is just what they expected -- as such the HTTP client should return or throw such an error, but _not_ log it.

Do also note that in situations when you decide to log an error, be mindful of error rates. Will this error potentially be logged for every single operation while some network failure is happening? Some teams and companies have alerting systems set up based on the rate of errors logged in a system, and if it exceeds some threshold it may start calling and paging people in the middle of the night. When logging at error level, consider if the issue indeed is something that should be waking up people at night. You may also want to consider offering configuration in your library: "at what log level should this issue be reported?" This can come in handy in clustered systems which may log network failures themselves, or depend on external systems detecting and reporting this.

Logging `critical` logs is allowed for libraries, however as the name implies - only in the most critical situations. Most often this implies that the library will *stop functioning* after such log has been issued. End users are thought to expect that a logged critical error is _very_ important, and they may have set up their systems to page people in the middle of the night to investigate the production system _right now_ when such log statements are detected. So please be careful about logging these kinds of errors.

Some libraries and situations may not be entirely clear with regard to what log level is "best" for them. In such situations, it sometimes is worth it to allow the end-users of the library to be able to configure the levels of specific groups of messages. You can see this in action in the Soto library [here](https://github.com/soto-project/soto-core/pull/423/files#diff-4a8ca7e54da5b22287900dd8cf6b47ded38a94194c1f0b544119030c81a2f238R649) where an `Options` object allows end users to configure the level at which requests are logged (`options.requestLogLevel`) which is then used as `log.log(self.options.requestLogLevel)`.

#### Examples

`trace` level logging:

- Could include various additional information about a request, such as various diagnostics about created data structures, the state of caches or similar, which are created in order to serve a request.
- Could include "begin operation" and "end operation" logging statements.

`debug` level logging:

- May include a single log statement for opening a connection, accepting a request, and so on.
- It can include a _high level_ overview of control flow in an operation. For example: "started work, processing step X, made X decision, finished work X, result code 200".  This overview may consist of high cardinality structured data.

> You may also want to consider using [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing) to instrument "begin" and "end" events, as tracing may give you additional insights into your system behavior you would have missed with just manually analysing log statements.

### Log levels to avoid

All these rules are only _general_ guidelines, and as such may have exceptions. Consider the following examples and rationale for why logging at high log levels by a library may not be desirable:

It is generally _not acceptable_ for a service client (for example, an http client) to log an `error` when a request has failed. End-users may be using the client to probe if an endpoint is even responsive or not, and a failure to respond may be _expected_ behavior. Logging errors would only confuse and pollute their logs.

Instead, libraries should either `throw`, or return an `Error` value that users of the library will have enough knowledge about if they should log or ignore it.

It is even less acceptable for a library to log any successful operations. This leads to flooding server side systems, especially if, for example, one were to log every successfully handled request. In a server side application, this can easily flood and overwhelm logging systems when deployed to production where many end users are connected to the same server. Such issues are rarely found in development time, because of only a single peer requesting things from the service-under-test.

#### Examples (of things to avoid)

Avoid using `info` or any higher log level for:

- "Normal operation" of the library, that is there is no need to log on info level "accepted a request" as this is the normal operation of a web service.

Avoid using `error` or `warning`:

- To report errors which the end-user of the library has the means of logging themselves. For example, if a database driver fails to fetch all rows of a query, it should not log an error or warning, but instead return or throw an error on the stream of values (or function, async function, or even the async sequence) that was providing the returned values.
  - Since the end-user is consuming these values, and has a mean of reporting (or swallowing) this error, the library should not log anything on their behalf.
- Never report as warnings which is merely an information. For example. "weird header detected" may look like a good idea to log as a warning at first sight, however if the "weird header" is simply a misconfigured client (or just a "weird browser") you may be accidentally completely flooding an end-users logs with these "weird header" warnings (!)
  - Only log warnings about actionable things which the end-user of your library can do something about. Using the "weird header detected" log statement as an example: it would not be a good candidate to log as a warning because the server developer has no way to fix the users of their service to stop sending weird headers, so the server should not be logging this information as a warning.
- It may be tempting to implement a "log as warning only once" technique for per-request style situations which may be almost important enough to be a warning, but should not be logged repeatedly after all. Authors may think of smart techniques to log a warning only once per "weird header discovered" and later on log the same issue on a different level, such as trace... Such techniques result in confusing hard to debug logs, where developers of a system unaware of the stateful nature of the logging would be left confused when trying to reproduce the issue.
  - For example, if a developer spots such a warning in a production system, they may attempt to reproduce it — thinking that it only happens in the production environment. However, if the logging system's log level choice is _stateful_ they may actually be successfully reproducing the issue but never seeing it manifest. For this, and related performance reasons (as implementing "only once per X" implies growing storage and per-request additional checking requirements), it is not recommended to apply this pattern.

Exceptions to the "avoid logging warnings" rule:

- "Background processes" such as tasks scheduled on a periodic timer, may not have any other means of communicating a failure or warning to the end user of the library other than through logging.
  - Consider offering an API that would collect errors at runtime, and then you can avoid logging errors manually. This can often take the form of a customizable "on error" hook that the library accepts when constructing the scheduled job. If the handler is not customized, we can log the errors, but if it was, it again is up to the end-user of the library to decide what to do with them.
- An exception to the "log a warning only once" rule is when things do not happen very frequently. For example, if a library is warning about an outdated license or something similar during _its initialization_ this isn't necessarily a bad idea. After all, we'd rather see this warning once during initialization rather during every request made to the library. Use your best judgement and consider the developers using your library when designing how often and where from to log such information.

### Suggested logging style

While libraries are free to use whichever logging message style they choose, here are some best practices to follow if you want users of your libraries to *love* the logs your library produces.

Firstly, it is important to remember that both the message of a log statement as well as the metadata in [swift-log](https://github.com/apple/swift-log) are [autoclosures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html#ID543), which are only invoked if the logger has a log level set such that it must emit a message for the message given. As such, messages logged at `trace` do not "materialize" their string and metadata representation unless they are actually needed:

```swift
    public func debug(_ message: @autoclosure () -> Logger.Message,
                      metadata: @autoclosure () -> Logger.Metadata? = nil,
                      source: @autoclosure () -> String? = nil,
                      file: String = #file, function: String = #function, line: UInt = #line) {
```

And a minor yet important hint: avoid inserting newlines and other control characters into log statements (!). Many log aggregation systems assume that a single line in a logged output is specifically "one log statement" which can accidentally break if we log not sanitized, potentially multi-line, strings. This isn't a problem for _all_ log backends. For example, some will automatically sanitize and form a JSON payload with `{message: "..."}` before emitting it to a backend service collecting the logs, but plain old stream (or file) loggers usually assume that one line equals one log statement. It also makes grepping through logs more reliable.

#### Structured Logging (Semantic Logging)

Libraries may want to embrace the structured logging style, which renders logs in a [semi-structured data format](https://en.wikipedia.org/wiki/Semi-structured_data).

It is a fantastic pattern which makes it easier and more reliable for automated code to process logged information.

Consider the following "not structured" log statement:

```swift
// NOT structured logging style
log.info("Accepted connection \(connection.id) from \(connection.peer), total: \(connections.count)")
```

It contains 4 pieces of information:

- We accepted a connection.
- This is its string representation.
- It is from this peer.
- We currently have `connections.count` active connections.

While this log statement contains all useful information that we meant to relay to end users, it is hard to visually and mechanically parse the detailed information it contains. For example, if we know connections start failing around the time when we reach a total of 100 concurrent connections, it is not trivial to find the specific log statement at which we hit this number. We would have to `grep 'total: 100'` for example, however perhaps there are many other `"total: "` strings present in all of our log systems.

Instead, we can express the same information using the structured logging pattern, as follows:

```swift
log.info("Accepted connection", metadata: [
  "connection.id": "\(connection.id)",
  "connection.peer": "\(connection.peer)",
  "connections.total": "\(connections.count)"
])

// example output:
// <date> info [connection.id:?,connection.peer:?, connections.total:?] Accepted connection
```

This structured log can be formatted, depending on the logging backend, slightly differently on various systems. Even in the simple string representation of such a log, we'd be able to grep for `connections.total: 100` rather than having to guess the correct string.

Also, since the message now does not contain all that much "human readable wording", it is less prone to randomly change from "Accepted" to "We have accepted" or vice versa. This kind of change could break alerting systems which are set up to parse and alert on specific log messages.

Structured logs are very useful in combination with [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing)'s `LoggingContext`, which automatically populates the metadata with any present trace information. Thanks to this, all logs made in response to some specific request will automatically carry the same TraceID.

You can see more examples of structured logging on the following pages, and example implementations thereof:

- <https://tersesystems.com/blog/2020/05/26/why-i-wrote-a-logging-library/>
- <https://cloud.google.com/logging/docs/structured-logging>
- <https://stackify.com/what-is-structured-logging-and-why-developers-need-it/>
- <https://kubernetes.io/blog/2020/09/04/kubernetes-1-19-introducing-structured-logs/>

#### Logging with Correlation IDs / Trace IDs

A very common pattern is to log messages with some "correlation id". The best approach in general here is to use a `LoggingContext` from [swift-distributed-tracing](https://github.com/apple/swift-distributed-tracing) as then your library will be able to be traced and used with correlation contexts regardless what tracing system the end-user is using (such as open telemetry, zipkin, xray, and other tracing systems) The concept though can be explained well with just a manually logged `requestID` which we'll explain below.

Consider an HTTP client as an example of a library that has a lot of metadata about some request, perhaps something like this:

```swift
log.trace("Received response", metadata: [
   "id": "...",
   "peer.host": "...",
   "payload.size": "...",
   "headers": "...",
   "responseCode": "...",
   "responseCode.text": "...",
])
```

The exact metadata does not matter, they're just some placeholder in this example. What matters is that there's "a lot of it".

> Side note on metadata keys: while there is no single right way to structure metadata keys, we recommend thinking of them as-if JSON keys: camelCased and `.` separated identifiers. This allows many log analysis backends to treat them as such nested structure.

Now, we would like to avoid logging _all_ this information in every single log statement. Instead, we are able to just repeatedly log the `"id"` metadata, like this:

```swift
// ...
log.trace("Something something...", metadata: ["id": "..."])
log.trace("Finished streaming response", metadata: ["id": "..."]) // good, the same ID is propagated
```

Thanks to the correlation ID (or a tracing provided ID, in which case we'd log as `context.log.trace("...")` as the ID is propagated automatically), in each following log statement after the initial log statement we're able to correlate all those log statements. Then we know that this `"Finished streaming response"` message was about a response with a `responseCode` that we're able to look up from the `"Received response"` log message.

This pattern is somewhat advanced and may not always be the right approach, but consider it in high performance code where logging the same information repeatedly can be too costly.

##### Things to avoid with Correlation ID logging

When logging with correlation contexts make sure to never "drop the ID". It is easiest to get this right when using distributed tracing's `LoggingContext` since propagating it ensures the carrying of identifiers, however the same applies to any kind of correlation identifier.

Specifically, avoid situations like these:

```swift
debug: connection established [connection-id: 7]
debug: connection closed unexpectedly [error: foobar] // BAD, the connection-id was dropped
```

On the second line, we don't know which connection had the error since the `connection-id` was dropped. Make sure to audit your logging code to ensure all relevant log statements carry necessary correlation identifiers.

### Exceptions to the rules

These are only general guidelines, and there always will be exceptions to these rules and other situations where these suggestions will be broken, for good reason. Please use your best judgement, and always consider the end-user of a system, and how they'll be interacting with your library and decide case-by-case depending on the library and situation at hand how to handle each situation.

Here are a few examples of situations when logging a message on a relatively high level might still be tolerable for a library.

It's permissible for a library to log at `critical` level right before a _hard_ crash of the process, as a last resort of informing the log collection systems or end-user about additional information detailing the reason for the crash. This should be _in addition to_ the message from a `fatalError` and can lead to an improved diagnosis/debugging experience for end users.

Sometimes libraries may be able to detect a harmful misconfiguration of the library. For example, selecting deprecated protocol versions. In such situations it may be useful to inform users in production by issuing a `warning`. However you should ensure that the warning is not logged repeatedly! For example, it is not acceptable for an HTTP client to log a warning on every single http request using some misconfiguration of the client. It _may_ be acceptable however for the client to log such a warning, for example, _once_ at configuration time, if the library has a good way to do this.

Some libraries may implement a "log this warning only once", "log this warning only at startup", "log this error only once an hour", or similar tricks to keep the noise level low but still informative enough to not be missed. This is, however, usually a pattern reserved for stateful long running libraries, rather than clients of databases and related persistent stores.
