const { userAgentData, userAgent } = window.navigator;

const osToOsRegex = {
  Windows: /win/,
  macOS: /macintosh/,
  Linux: /linux/,
}

const osToPage = {
  Windows: '/install/windows/',
  macOS: '/install/macos/',
  Linux: '/install/linux/',
}

const OS = Object.keys(osToOsRegex).find(os => osToOsRegex[os].test(userAgent.toLowerCase())) || 'macOS';

window.location.replace(OS);
