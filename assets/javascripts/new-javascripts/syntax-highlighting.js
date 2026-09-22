// Syntax highlighting for fenced code blocks.
//
// The markup is kramdown's (`<div class="language-x highlighter-rouge">…`),
// which the stylesheet and the copy-to-clipboard button both rely on; the
// tokens inside `<code>` are added here, from the language named by its class.
//
// Blocks in a language highlight.js doesn't know are left as plain text, which
// is what the Jekyll site did with them too.
(function () {
  if (!window.hljs) return;

  // The site labels Windows shell samples `batch`, which highlight.js calls `dos`.
  hljs.registerAliases('batch', { languageName: 'dos' });

  hljs.configure({ cssSelector: '.highlighter-rouge pre code', ignoreUnescapedHTML: true });
  hljs.highlightAll();
})();
