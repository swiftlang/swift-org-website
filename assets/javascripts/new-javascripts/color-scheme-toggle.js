document.addEventListener('DOMContentLoaded', initColorScheme);

const ColorScheme = {
  auto: 'auto',
  light: 'light',
  dark: 'dark',
};

const localStorageKey = 'developer.setting.preferredColorScheme';

const supportsAutoColorScheme = (() => {
  return typeof window.matchMedia !== 'undefined' &&
    ['light', 'dark', 'no-preference'].some(
      (scheme) => window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches
    );
})();

if (!supportsAutoColorScheme) {
  document.getElementById('scheme-auto-wrapper')?.remove();
}

function initColorScheme() {
  setColorScheme(getStoredScheme());

  const toggle = getToggle();
  if (toggle && toggle.value !== getStoredScheme()) {
    toggle.value = getStoredScheme();
  }

  getToggleForm()?.addEventListener('change', (e) => {
    setColorScheme(e.target.value);
  });
}

function systemPrefersLight() {
  return window.matchMedia('(prefers-color-scheme: light)');
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function isSystemDark() {
  return systemPrefersDark().matches;
}

function setColorScheme(value) {
  if (!Object.values(ColorScheme).includes(value)) {
    value = supportsAutoColorScheme ? ColorScheme.auto : ColorScheme.light;
  }

  if (value === ColorScheme.auto) {
    updateScheme(isSystemDark() ? ColorScheme.dark : ColorScheme.light, value);
  } else {
    updateScheme(value);
  }
}

function updateScheme(scheme, storedValue = scheme) {
  if (getStoredScheme() !== storedValue) {
    saveScheme(storedValue);
  }

  if (getCurrentScheme() !== scheme) {
    document.body.setAttribute('data-color-scheme', scheme);
  }

  const toggle = getToggle();
  if (toggle && toggle.value !== storedValue) {
    toggle.value = storedValue;
  }
}

systemPrefersLight().addEventListener('change', (e) => {
  if (e.matches && getStoredScheme() === ColorScheme.auto) {
    const current = getCurrentScheme();
    if (current !== ColorScheme.light) {
      document.body.setAttribute('data-color-scheme', ColorScheme.light);
    }
  }
});

systemPrefersDark().addEventListener('change', (e) => {
  if (e.matches && getStoredScheme() === ColorScheme.auto) {
    const current = getCurrentScheme();
    if (current !== ColorScheme.dark) {
      document.body.setAttribute('data-color-scheme', ColorScheme.dark);
    }
  }
});

window.addEventListener('storage', () => {
  setColorScheme(getStoredScheme());
});

window.addEventListener('pageshow', () => {
  setColorScheme(getStoredScheme());
});

function getToggleForm() {
  return document.getElementById('color-scheme-toggle');
}

function getToggle() {
  return getToggleForm()?.elements['color-scheme-preference'];
}

function getCurrentScheme() {
  return document.body.getAttribute('data-color-scheme');
}

function getStoredScheme() {
  try {
    return localStorage.getItem(localStorageKey);
  } catch {
    return null;
  }
}

function saveScheme(value) {
  try {
    localStorage.setItem(localStorageKey, value);
  } catch {
  }
}
