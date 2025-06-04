function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  var classString = element.className,
    nameIndex = classString.indexOf(className)
  if (nameIndex == -1) {
    classString += ' ' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

document
  .getElementById('menu-toggle')
  .addEventListener('mousedown', function () {
    const menuToggle = document.getElementById('menu-toggle')
    toggleClass(menuToggle, 'open')
    menuToggle.setAttribute(
      'aria-expanded',
      menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
    )
    toggleClass(document.querySelector('nav.mobile-navigation'), 'open')
  })

document.addEventListener('DOMContentLoaded', function () {
  const sectionToggles = document.querySelectorAll('.section-toggle')

  sectionToggles.forEach(function (toggle) {
    toggle.addEventListener('mousedown', function () {
      var navSubmenu = toggle.closest('.link-container').nextElementSibling

      if (navSubmenu) {
        toggleClass(navSubmenu, 'open')
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true'
        toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
      }
    })
  })
})

if (navigator && navigator.clipboard) {
  const codeBlocks = document.querySelectorAll(
    ':is([class^="language-"] pre.highlight, .code-box pre code)',
  );

  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
  const copiedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;

  codeBlocks.forEach((codeBlock) => {
    const button = document.createElement('button');
    const codeElement = codeBlock.querySelector('code') || codeBlock;
    const container = codeBlock.parentElement;

    button.classList.add('copy-button');
    container.appendChild(button);
    button.innerHTML = copyIcon

    button.addEventListener('mousedown', async () => {
      const originalIcon = copyIcon; // Store the original icon

      try {
        await navigator.clipboard.writeText(codeElement.innerText);

        button.classList.add('copied');
        button.innerHTML = copiedIcon;

        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = originalIcon;
        }, 1000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setTimeout(() => {
          button.innerHTML = originalIcon; // Revert to original icon
        }, 1000);
      }
    });
  });
}

// Check for reduced motion setting
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion')
}

// code-box
const codeBoxes = document.querySelectorAll('.code-box-with-tabs')

if (codeBoxes.length) {
  const ACTIVE_CLASS = 'active'

  codeBoxes.forEach((codeBox) => {
    const tabNav = codeBox.querySelector('nav')
    const navItems = tabNav.querySelectorAll('li')
    const codeBlocks = codeBox.querySelectorAll('pre')
    let activeIndex = 0

    navItems.forEach((item) => {
      item.addEventListener('click', (evt) => {
        const targetIndex = evt.target.getAttribute('data-tab-index')
        if (!targetIndex || evt.target.classList.contains(ACTIVE_CLASS)) return
        navItems[activeIndex].classList.remove(ACTIVE_CLASS)
        codeBlocks[activeIndex].classList.remove(ACTIVE_CLASS)
        activeIndex = evt.target.getAttribute('data-tab-index')
        navItems[activeIndex].classList.add(ACTIVE_CLASS)
        codeBlocks[activeIndex].classList.add(ACTIVE_CLASS)
      })
    })
  })
}
