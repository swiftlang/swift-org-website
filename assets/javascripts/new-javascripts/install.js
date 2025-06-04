const { userAgent } = window.navigator

const osToRegex = {
  windows: /win/,
  macos: /macintosh/,
  linux: /linux/,
}

const detectedOS =
  Object.keys(osToRegex).find((os) =>
    osToRegex[os].test(userAgent.toLowerCase()),
  ) || 'linux'

// Utility in case we need just to hightlight the tab
// document.querySelectorAll('.interactive-tabs.os').forEach(tabBlock => {
//     const links = tabBlock.querySelectorAll('[data-tab-name]');

//     links.forEach(link => {
//         const isActive = link.dataset.tabName === activeTabName;
//         link.setAttribute('aria-pressed', isActive ? 'true' : 'false');
//     });
// });

window.location.replace(detectedOS)
