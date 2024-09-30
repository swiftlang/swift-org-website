const { userAgentData, userAgent } = window.navigator;

const osToOsRegex = {
  windows: /win/,
  macos: /macintosh/,
  linux: /linux/,
};

const osToPage = {
  windows: "/install/windows/",
  macos: "/install/macos/",
  linux: "/install/linux/",
};

const OS =
  Object.keys(osToOsRegex).find((os) =>
    osToOsRegex[os].test(userAgent.toLowerCase()),
  ) || "macos";

window.location.replace(OS);
