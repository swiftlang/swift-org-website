---
layout: source
---

{% include_relative vendor/gumshoe.min.js %}

(function() {
    gumshoe.init({
        selector: 'nav[role="navigation"] > ul li.active ul li a',
        selectorHeader: 'nav[role="navigation"] > ul li.active',
        offset: 0,
        activeClass: 'active',
        callback: function (nav) {
            var title = document.title + " - " + nav.target.textContent
            var hash = "#" + nav.target.id;
            if (window.location.hash !== hash) {
                history.replaceState(null, title, window.location.pathname + hash);
            }
        }
    });

    function toggleClass(element, className){
        if (!element || !className){
            return;
        }

        var classString = element.className, nameIndex = classString.indexOf(className);
        if (nameIndex == -1) {
            classString += ' ' + className;
        } else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
        }
        element.className = classString;
    }

    document.getElementById('menu-toggle').addEventListener('mousedown', function() {
        toggleClass(document.getElementById('menu-toggle'), 'open');
        toggleClass(document.querySelector('nav[role="navigation"]'), 'open');
    });
})();
