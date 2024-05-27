const { userAgentData, userAgent } = window.navigator;

const osToOsRegex = {
  windows: /win/,
  macos: /macintosh/,
  linux: /linux/,
}

const osToPage = {
  Windows: '/install/windows/',
  macOS: '/install/macos/',
  Linux: '/install/linux/',
}

const OS = Object.keys(osToOsRegex).find(os => osToOsRegex[os].test(userAgent.toLowerCase())) || 'macOS';

window.location.replace(OS);
