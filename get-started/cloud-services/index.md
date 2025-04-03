---
layout: new-layouts/base
title: Use case
---

<section id="cloud-services-case-hero" class="section">
    <div class="hero-content">
        <h1>Create cloud services with Swift</h1>
        <p>Subtitle text</p>
        <ul>
            {% for box in site.data.new-data.get-started.cloud-services.hero-boxes %}
                <li>
                    <span class="title">{{ box.title }}</span>
                    <span class="text">{{ box.text }}</span>
                </li>
            {% endfor %}
        </ul>
        <a href="/" data-text="Get Started">Get Started</a>
        <div class="swoop swoop-1"></div>
        <div class="swoop swoop-2"></div>
    </div>
</section>

{% assign frameworks_packages = site.data.new-data.get-started.cloud-services.frameworks-packages %}

<div id="frameworks-packages" class="section">
    <div class="content">
        <img class="section-icon" src="{{ frameworks_packages.image }}" alt="{{ frameworks_packages.image_alt }}" />
        <h2>{{ frameworks_packages.title }}</h2>
        <ul class="featured">
            {% for package in frameworks_packages.featured %}
                <li>
                    <img src="{{ package.logo }}" alt="{{ package.logo_alt }}" />
                    <div>
                        <span class="name">{{ package.name }}</span>
                        <span class="text">{{ package.text }}</span>
                        <a href="{{ package.link }}">{{ package.link_text }} <i></i></a>
                    </div>
                </li>
            {% endfor %}
        </ul>
        <ul class="others">
            {% for package in frameworks_packages.others %}
                <li>
                    <div>
                        <span class="name">{{ package.name }}</span>
                        <span class="text">{{ package.text }}</span>
                        <a href="{{ package.link }}">{{ package.link_text }} <i></i></a>
                    </div>
                </li>
            {% endfor %}
        </ul>
        <a href="{{ frameworks_packages.link }}">{{ frameworks_packages.link_text }} <i></i></a>
    </div>
</div>

{% include new-includes/components/image-text-section.html image-section = site.data.new-data.get-started.cloud-services.image-text-section.image text-section = site.data.new-data.get-started.cloud-services.image-text-section.copy %}

{% include new-includes/components/headline-section.html content = site.data.new-data.get-started.cloud-services.headline-section %}

{% include new-includes/components/code-box.html content = site.data.new-data.get-started.cloud-services.code-box %}
