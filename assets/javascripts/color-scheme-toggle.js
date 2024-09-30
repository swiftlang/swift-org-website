document.addEventListener("DOMContentLoaded", ready);

const ColorScheme = {
  auto: "auto",
  light: "light",
  dark: "dark",
};

// Must be same as key used by microsites so that the preferences stick across microsites
const localStorageKey = "developer.setting.preferredColorScheme";

const supportsAutoColorScheme =
  typeof window.matchMedia !== "undefined" &&
  [ColorScheme.light, ColorScheme.dark, "no-preference"].some(
    (scheme) => window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches,
  );

// Hide auto as an option if the system doesn't support light/dark/auto
if (!supportsAutoColorScheme) {
  document.getElementById("scheme-auto-wrapper").remove();
}

//////////////////////////////////

setColorSchemeFor(preferredColorSchemeSetting());

//////////////////////////////////
/* Events */

// When localStorage changes
window.addEventListener("storage", (e) => {
  // If newValue is not a ColorScheme value (e.g., user manipulated localStorage)
  // Use the oldValue
  if (ColorScheme[e.newValue] == undefined) {
    if (ColorScheme[e.oldValue] == undefined) {
      if (supportsAutoColorScheme) {
        setColorSchemeFor(ColorScheme.auto);
      } else {
        setColorSchemeFor(ColorScheme.light);
      }
    } else {
      setColorSchemeFor(e.oldValue);
    }
  } else {
    setColorSchemeFor(e.newValue);
  }
});

// Needed to update page when Safari back button is used after toggle has been changed
window.addEventListener("pageshow", () => {
  setColorSchemeFor(preferredColorSchemeSetting());
});

systemLightMedia().addEventListener("change", (e) => {
  if (e.matches && preferredColorSchemeIsAuto()) {
    updateColorSchemeAttribute(ColorScheme.light);
  }
});

systemDarkMedia().addEventListener("change", (e) => {
  if (e.matches && preferredColorSchemeIsAuto()) {
    updateColorSchemeAttribute(ColorScheme.dark);
  }
});

//////////////////////////////////
/* General */

function setColorSchemeFor(value) {
  switch (value) {
    case ColorScheme.light:
      changeColorScheme(ColorScheme.light);
      break;
    case ColorScheme.dark:
      changeColorScheme(ColorScheme.dark);
      break;
    case ColorScheme.auto:
    default:
      // Update to light or dark, depending on current system situation
      let systemColorScheme = systemIsDark()
        ? ColorScheme.dark
        : ColorScheme.light;
      changeColorScheme(systemColorScheme, ColorScheme.auto);
      break;
  }
}

function changeColorScheme(color, setting = color) {
  // Don't unnecessarily set localStorage if same value
  if (setting !== preferredColorSchemeSetting()) {
    updateColorSchemeSetting(setting);
  }

  // Don't unnecessarily change body attribute if same value
  if (getColorSchemeAttribute() !== color) {
    updateColorSchemeAttribute(color);
  }

  // Don't unnecessarily set the toggle if same value
  if (!!getToggleRadioNodeList()) {
    if (getToggle().value !== setting) {
      setToggleTo(setting);
    }
  }
}
//////////////////////////////////
/* System values */

function systemLightMedia() {
  return window.matchMedia("(prefers-color-scheme: light)");
}

function systemDarkMedia() {
  return window.matchMedia("(prefers-color-scheme: dark)");
}

//////////////////////////////////
/* Getters and Setters for system values */

function getToggleRadioNodeList() {
  return document.getElementById("color-scheme-toggle");
}

function getToggle() {
  return getToggleRadioNodeList().elements["color-scheme-preference"];
}

function setToggleTo(value) {
  getToggle().value = value;
}

// Boolean if is given value
function getColorSchemeAttribute() {
  return document.body.getAttribute("data-color-scheme");
}

function updateColorSchemeAttribute(color) {
  document.body.setAttribute("data-color-scheme", color);
}

function preferredColorSchemeSetting() {
  try {
    return window.localStorage.getItem(localStorageKey);
  } catch (_) {
    // referencing `localStorage` when "Block all cookies" is enabled
    // will throw an error
    return null;
  }
}

function updateColorSchemeSetting(color) {
  try {
    window.localStorage.setItem(localStorageKey, color);
  } catch (_) {
    // referencing `localStorage` when "Block all cookies" is enabled
    // will throw an error
  }
}

//////////////////////////////////
/* Utils */

function systemIsLight() {
  return systemLightMedia().matches;
}

function systemIsDark() {
  return systemDarkMedia().matches;
}

// Boolean if localStorage setting is Auto
function preferredColorSchemeIsAuto() {
  return preferredColorSchemeSetting() == ColorScheme.auto;
}

function ready() {
  if (getToggle().value !== preferredColorSchemeSetting()) {
    setToggleTo(preferredColorSchemeSetting());
  }

  getToggleRadioNodeList().addEventListener("change", (e) => {
    setColorSchemeFor(e.target.value);
  });
}
