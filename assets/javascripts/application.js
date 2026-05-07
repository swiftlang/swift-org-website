---
layout: source
---

(function () {
  var navbarElement = document.querySelectorAll('nav[role="navigation"] > .list-items > ul li.active ul li a');
  var headerElement = document.querySelectorAll('nav[role="navigation"] > .list-items > ul li.active ul li');

  var activeClass = "active";

  Array.prototype.forEach.call(navbarElement, (element) => {
    element.addEventListener("click", (e) => {
      var target = e.target;
      var title = document.title + " - " + target.textContent;
      var hash = "#" + target.id;
      if (window.location.hash !== hash) {
        history.replaceState(null, title, window.location.pathname + hash);
      }
      Array.prototype.forEach.call(headerElement, (element) => {
        element.classList.remove(activeClass);
      });
      target.parentElement.classList.add(activeClass);
    });
  });

  function toggleClass(element, className) {
    if (!element || !className) {
      return;
    }
    var classString = element.className, nameIndex = classString.indexOf(className);
    if (nameIndex == -1) {
      classString += " " + className;
    } else {
      classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
    }
    element.className = classString;
  }

  document.getElementById('menu-toggle').addEventListener('mousedown', function() {
    const menuToggle = document.getElementById('menu-toggle');
    toggleClass(menuToggle, 'open');
    menuToggle.setAttribute('aria-expanded', menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    toggleClass(document.querySelector('nav.mobile-navigation'), 'open');
  });

  document.addEventListener('DOMContentLoaded', function() {
    const sectionToggles = document.querySelectorAll('.section-toggle');

    sectionToggles.forEach(function(toggle) {
      toggle.addEventListener('mousedown', function() {
        var navSubmenu = toggle.closest('.link-container').nextElementSibling;

        if (navSubmenu) {
          toggleClass(navSubmenu, 'open');
          var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        }
      });
    });

    const interactiveTabs = document.querySelectorAll('.interactive-tabs');

    if (interactiveTabs.length > 0) {
      interactiveTabs.forEach(function(interactiveTab) {
        const tabButtons = interactiveTab.querySelectorAll('.interactive-tabs button');

        if (tabButtons.length > 0) {
          tabButtons.forEach(function(tabButton) {
            tabButton.addEventListener('click', function(e) {
              const activeTabButton = interactiveTab.querySelector('button[aria-pressed="true"]');
              const activeContent = interactiveTab.querySelector('.content.active');
              const content = interactiveTab.querySelector(`.content[data-tab='${tabButton.textContent}']`);

              if (activeTabButton) {
                activeTabButton.setAttribute('aria-pressed', 'false');
              }

              e.currentTarget.setAttribute('aria-pressed', 'true');

              if (activeContent) {
                activeContent.classList.remove('active');
              }

              content.classList.add('active');
            });
          });
        }
      })
    }

    function initializeCopyButtons() {
      if (!(navigator && navigator.clipboard)) {
        return;
      }

      const copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
      const copiedIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>';

      document.querySelectorAll('pre:not(.no-copy)').forEach(function(pre) {
        if (pre.querySelector('.copy-button')) {
          return;
        }

        const codeElement = pre.querySelector('code') || pre;
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'copy-button';
        button.setAttribute('aria-label', 'Copy code');
        button.title = 'Copy code';
        button.innerHTML = copyIcon;
        pre.appendChild(button);

        button.addEventListener('click', async function(event) {
          event.preventDefault();

          const rawText = codeElement.innerText.trim();
          const separatorIndex = rawText.search(/\n\s*--\s*(?:\n|$)/);
          const clipboardText = separatorIndex >= 0 ? rawText.slice(0, separatorIndex).trim() : rawText;

          try {
            await navigator.clipboard.writeText(clipboardText);

            button.classList.add('copied');
            button.innerHTML = copiedIcon;

            setTimeout(() => {
              button.classList.remove('copied');
              button.innerHTML = copyIcon;
            }, 1200);
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
        });
      });
    }

    initializeCopyButtons();
  });
})();
