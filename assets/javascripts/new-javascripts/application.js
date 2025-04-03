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
    ':is([class^="language-"] pre.highlight, .code-block pre code)',
  )

  codeBlocks.forEach((codeBlock) => {
    const button = document.createElement('button')
    const codeElement = codeBlock.querySelector('code') || codeBlock
    const container = codeBlock.parentElement

    container.style.position = 'relative'
    container.appendChild(button)
    button.innerText = 'copy'

    button.addEventListener('mousedown', async () => {
      const originalText = button.innerText

      await navigator.clipboard.writeText(codeElement.innerText)
      button.innerText = 'copied!'

      setTimeout(() => {
        button.innerText = originalText
      }, 1000)
    })
  })
}

// Check for reduced motion setting
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion')
}
