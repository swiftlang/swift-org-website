---
layout: new-layouts/base
title: Embedded
---

<section id="cloud-services-case-hero" class="section">
    <div class="hero-content">
        <h1>Create embedded software with Swift</h1>
        <p>Get all the safety, speed, approachability, and interoperability of Swift in your embedded software with Embedded Swift</p>
        <ul>
            {% for box in site.data.new-data.get-started.embedded.hero-boxes %}
                <li>
                    <span class="title">{{ box.title }}</span>
                    <span class="text">{{ box.text }}</span>
                </li>
            {% endfor %}
        </ul>
        <a href="/" data-text="Get Started">Get Started</a>
        <!-- Disabled due to a bug in layout -->
        <!-- <div class="swoop swoop-1"></div>
        <div class="swoop swoop-2"></div> -->
    </div>
</section>


{% include new-includes/components/headline-section.html content = site.data.new-data.get-started.embedded.headline-section %}
