---
---

<h1>Swift.org Storybook</h1>

<button class="storybook-source-html">source HTML</button>
<button class="storybook-source-css">source CSS</button>

<input type="search" placeholder="Filter Elements" oninput="filterComponents(event)">

{% assign folders = "stories/classes,stories/components" | split: "," %}
{% for folder in folders %}
{% capture folder_output %}
<h2>{{ folder | split: "/" | last | capitalize }}</h2>

{% for file in site.static_files %}
{% if file.path contains folder %}
<a href="/storybook#{{ file.name | split: '.' | first }}">{{ file.name | split: '.' | first }}</a>
{% endif %}
{% endfor %}
{% endcapture %}
{{ folder_output | markdownify }}
{% endfor %}

<script>
    function filterComponents(e) {
        const components = document.querySelectorAll("a");
        const searchComponentString = e.target.value.trim().toLowerCase();

        components.forEach(component => {
            component.style.display = 'revert';

            if (!component.innerText.toLowerCase().includes(searchComponentString)) {
                component.style.display = 'none';
            }
        })
    }

    const sourceHtmlButton = document.querySelector('.storybook-source-html');

    sourceHtmlButton.addEventListener('click', () => {
        window.open('https://github.com/swiftlang/swift-org-website/blob/new-layout/_layouts/new-layouts/storybook.html', '_blank');
    });

    const sourceCssButton = document.querySelector('.storybook-source-css');

    sourceCssButton.addEventListener('click', () => {
        window.open('https://github.com/swiftlang/swift-org-website/blob/new-layout/assets/stylesheets/new-stylesheets/pages/_storybook.scss', '_blank');
    });
</script>
