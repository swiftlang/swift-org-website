(() => {
  const shadowRoot = document.querySelector("custom-header").shadowRoot;
  const header = shadowRoot.getElementById("header");
  const button = shadowRoot.getElementById("small-menu-toggle");

  // Since the styles are now applied using an external stylesheet and the
  // <link> element does not block painting of the shadow root [1][1], we need
  // to initially hide the header and only unhide it once the stylesheet has
  // been loaded to prevent a flash of unstyled content
  //
  // [1]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#internal_vs._external_styles
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute(
    "href",
    "https://swift.org/assets/stylesheets/docc/header.css",
  );
  link.onload = () => {
    header.hidden = false;
  };
  shadowRoot.appendChild(link);

  button.addEventListener("click", () => {
    header.toggleAttribute("data-small-menu-is-expanded");
  });
})();
