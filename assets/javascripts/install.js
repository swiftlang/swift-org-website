const { userAgentData, userAgent } = window.navigator;

const osToOsRegex = {
  Windows: /win/,
  macOS: /macintosh/,
  Linux: /linux/
}

const OS = Object.keys(osToOsRegex).find(os => osToOsRegex[os].test(userAgent.toLowerCase())) || 'macOS';
const interactiveTabs = document.querySelector('.interactive-tabs.os');
const OSButtons = interactiveTabs.querySelectorAll('.tabs button');
const OSButton = [...OSButtons].find(button => button.textContent === OS);
const OSContent = interactiveTabs.querySelector(`.content[data-tab="${OS}"]`);

OSButton.setAttribute('aria-pressed', 'true');
OSContent.classList.add('active');
