(function () {
  var navbarElement = document.querySelectorAll(
    'nav[role="navigation"] > .list-items > ul li.active ul li a',
  );
  var headerElement = document.querySelectorAll(
    'nav[role="navigation"] > .list-items > ul li.active ul li',
  );

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
    var classString = element.className,
      nameIndex = classString.indexOf(className);
    if (nameIndex == -1) {
      classString += " " + className;
    } else {
      classString =
        classString.substr(0, nameIndex) +
        classString.substr(nameIndex + className.length);
    }
    element.className = classString;
  }

  document
    .getElementById("menu-toggle")
    .addEventListener("mousedown", function () {
      const menuToggle = document.getElementById("menu-toggle");
      toggleClass(menuToggle, "open");
      menuToggle.setAttribute(
        "aria-expanded",
        menuToggle.getAttribute("aria-expanded") === "true" ? "false" : "true",
      );
      toggleClass(document.querySelector("nav.mobile-navigation"), "open");
    });

  document.addEventListener("DOMContentLoaded", function () {
    const sectionToggles = document.querySelectorAll(".section-toggle");

    sectionToggles.forEach(function (toggle) {
      toggle.addEventListener("mousedown", function () {
        var navSubmenu = toggle.closest(".link-container").nextElementSibling;

        if (navSubmenu) {
          toggleClass(navSubmenu, "open");
          var isExpanded = toggle.getAttribute("aria-expanded") === "true";
          toggle.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        }
      });
    });

    const interactiveTabs = document.querySelectorAll(".interactive-tabs");

    if (interactiveTabs.length > 0) {
      interactiveTabs.forEach(function (interactiveTab) {
        const tabButtons = interactiveTab.querySelectorAll(
          ".interactive-tabs button",
        );

        if (tabButtons.length > 0) {
          tabButtons.forEach(function (tabButton) {
            tabButton.addEventListener("click", function (e) {
              const activeTabButton = interactiveTab.querySelector(
                'button[aria-pressed="true"]',
              );
              const activeContent =
                interactiveTab.querySelector(".content.active");
              const content = interactiveTab.querySelector(
                `.content[data-tab='${tabButton.textContent}']`,
              );

              if (activeTabButton) {
                activeTabButton.setAttribute("aria-pressed", "false");
              }

              e.currentTarget.setAttribute("aria-pressed", "true");

              if (activeContent) {
                activeContent.classList.remove("active");
              }

              content.classList.add("active");
            });
          });
        }
      });
    }
  });
})();
