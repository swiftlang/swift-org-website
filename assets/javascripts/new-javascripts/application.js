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

document.querySelectorAll('h2.header-with-anchor').forEach(header => {
  if (!header.id) return;

  const link = document.createElement('a');
  link.href = `#${header.id}`;
  link.title = `Permalink for ${header.textContent}`;
  link.innerHTML = `<svg
    width="24px"
    height="24px"
    viewBox="0 0 14 14"
    role="img"
    focusable="false"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg">
      <path d="m 11.58824,9.823529 q 0,-0.294117 -0.20589,-0.499999 L 9.85294,7.794118 q -0.20588,-0.205883 -0.5,-0.205883 -0.30882,0 -0.52941,0.235295 0.0221,0.02206 0.13971,0.136029 0.11764,0.113971 0.15808,0.158088 0.0404,0.04412 0.1103,0.139706 0.0698,0.09559 0.0956,0.1875 0.0257,0.09191 0.0257,0.202206 0,0.294117 -0.20588,0.5 -0.20588,0.205882 -0.5,0.205882 -0.1103,0 -0.20221,-0.02573 Q 8.35293,9.301471 8.25733,9.231621 8.16173,9.161771 8.11763,9.121327 8.07353,9.080887 7.95954,8.963238 7.84557,8.845591 7.82351,8.823533 7.58086,9.051474 7.58086,9.360297 q 0,0.294118 0.20588,0.5 l 1.51471,1.522059 q 0.19853,0.19853 0.5,0.19853 0.29412,0 0.5,-0.191177 l 1.08088,-1.073529 q 0.20589,-0.205883 0.20589,-0.492648 z M 6.41912,4.639706 q 0,-0.294118 -0.20588,-0.5 L 4.69853,2.617647 q -0.20588,-0.205882 -0.5,-0.205882 -0.28677,0 -0.5,0.198529 L 2.61765,3.683823 q -0.20589,0.205883 -0.20589,0.492648 0,0.294117 0.20589,0.499999 l 1.52941,1.529412 q 0.19853,0.19853 0.5,0.19853 0.30882,0 0.52941,-0.227942 Q 5.15437,6.15441 5.03676,6.040441 4.91912,5.92647 4.87868,5.882353 4.83828,5.838233 4.76838,5.742647 q -0.0698,-0.09559 -0.0956,-0.1875 -0.0257,-0.09191 -0.0257,-0.202206 0,-0.294117 0.20588,-0.5 0.20588,-0.205882 0.5,-0.205882 0.1103,0 0.20221,0.02573 0.0919,0.02573 0.1875,0.09559 0.0956,0.06985 0.1397,0.110294 0.0441,0.04044 0.15809,0.158089 Q 6.15443,5.154409 6.17649,5.176467 6.41914,4.948526 6.41914,4.639703 z M 13,9.823529 q 0,0.882353 -0.625,1.492647 l -1.08088,1.07353 Q 10.68382,13 9.80147,13 q -0.88971,0 -1.5,-0.625 L 6.78676,10.852941 Q 6.17647,10.242647 6.17647,9.360294 q 0,-0.904412 0.64706,-1.536764 L 6.17647,7.176471 Q 5.54412,7.82353 4.64706,7.82353 q -0.88235,0 -1.5,-0.617648 L 1.617647,5.676471 Q 1,5.058824 1,4.176471 1,3.294118 1.625,2.683824 L 2.70588,1.610294 Q 3.31618,1 4.19853,1 q 0.88971,0 1.5,0.625 l 1.51471,1.522059 q 0.61029,0.610294 0.61029,1.492647 0,0.904412 -0.64706,1.536764 L 7.82353,6.823529 Q 8.45588,6.17647 9.35294,6.17647 q 0.88235,0 1.5,0.617648 l 1.52941,1.529411 Q 13,8.941176 13,9.823529 z"/>
    </svg>
  `;

  header.appendChild(link);
});