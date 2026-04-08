---
layout: new-layouts/base
title: Swift Programming Language
---

<div class="animation-container">
    <canvas id="purple-swoop" width="1248" height="1116"></canvas>
    <canvas id="white-swoop-1" width="1248" height="1116"></canvas>
    <canvas id="orange-swoop-top" width="1248" height="1116"></canvas>
    <canvas id="orange-swoop-bottom" width="1248" height="1116"></canvas>
    <canvas id="white-swoop-2" width="1248" height="1116"></canvas>
    <canvas id="bird" width="1248" height="1116"></canvas>
</div>
<section id="what-is-swift" class="section">
    <div class="hero-content">
        <h1>Swift is the powerful, flexible,<br /> multiplatform programming language.</h1>
        <div class="sub-text"><h2>Fast. Expressive. Safe.</h2></div>
        <a href="/install/" data-text="Install">Install</a>
        <p>Tools for Linux, macOS, and Windows</p>
        <h2>Create using Swift</h2>
    </div>
    <nav aria-label="Get started with Swift">
        <ul class="primary-links">
            {% for item in site.data.new-data.landing.get-started-primary %}
            <li>
                <a href="{{ item.link }}" data-text="{{ item.data-text }}">
                    <i class="{{ item.icon }}"></i>
                    <div>
                        <h3 class="title">{{ item.title }}</h3>
                        <p class="subtitle">{{ item.subtitle }}</p>
                    </div>
                </a>
            </li>
            {% endfor %}
        </ul>
        <ul class="secondary-links">
            {% for item in site.data.new-data.landing.get-started-secondary %}
            <li>
                <a href="{{ item.link }}" data-text="{{ item.data-text }}">
                    <h4 class="title">{{ item.title }}</h4>
                </a>
            </li>
            {% endfor %}
        </ul>
    </nav>
    <div class="swoop swoop-0 swoop-anim"></div>
</section>
{% assign pillar1_callouts = site.data.new-data.landing.callouts | slice: 0, 3 %}
{% assign pillar2_callouts = site.data.new-data.landing.callouts | slice: 3, 2 %}
{% assign pillar3_callouts = site.data.new-data.landing.callouts | slice: 5, 1 %}

<section id="pillar-1" class="section pillar">
    <div class="pillar-wrapper content-wrapper">
        <p class="pillar-intro">
            Swift is designed to be the language you reach for at every layer of the software stack. Whether you are building embedded firmware, full-featured mobile apps, or internet-scale services, Swift delivers expressive language features and APIs, performance control when you need it, and strong safety guarantees.
        </p>
    </div>
    {% for callout in pillar1_callouts %}
{% include new-includes/components/callout.html
    title=callout.title
    subtitle=callout.subtitle
    text=callout.text
    code=callout.code
    index=forloop.index
%}
    {% endfor %}

    <div class="swoop swoop-1 swoop-anim"></div>

</section>

<section id="pillar-2" class="section pillar">
    {% for callout in pillar2_callouts %}
{% include new-includes/components/callout.html
    title=callout.title
    subtitle=callout.subtitle
    text=callout.text
    code=callout.code
    index=forloop.index
%}
    {% endfor %}
    <div class="swoop swoop-2 swoop-anim"></div>
</section>

<section id="pillar-3" class="section pillar">
    {% for callout in pillar3_callouts %}
{% include new-includes/components/callout.html
    title=callout.title
    subtitle=callout.subtitle
    text=callout.text
    code=callout.code
    index=forloop.index
    links=callout.links
%}
    {% endfor %}
</section>
