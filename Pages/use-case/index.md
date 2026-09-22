---
template: bare
title: Use case
contentTemplating: true
---

<section id="cloud-services-case-hero" class="section">
    <div class="hero-content">
        <h1>Build cloud services with Swift</h1>
        <p>Subtitle text</p>
        <ul>
            #for(box in missingData.useCaseHeroBoxes):
                <li>
                    <span class="title">#(box.title)</span>
                    <span class="text">#(box.text)</span>
                </li>
            #endfor
        </ul>
        <a href="/" data-text="Get Started">Get Started</a>
        <div class="swoop swoop-1"></div>
        <div class="swoop swoop-2"></div>
    </div>
</section>



<div id="frameworks-packages" class="section">
    <div class="content">
        <img class="section-icon" src="" alt="" />
        <h2></h2>
        <ul class="featured">
            #for(package in missingData.frameworksPackages.featured):
                <li>
                    <img src="#(package.logo)" alt="#(package.logo_alt)" />
                    <div>
                        <span class="name">#(package.name)</span>
                        <span class="text">#(package.text)</span>
                        <a href="#(package.link)">#(package.link_text)</a>
                    </div>
                </li>
            #endfor
        </ul>
        <ul class="others">
            #for(package in missingData.frameworksPackages.others):
                <li>
                    <div>
                        <span class="name">#(package.name)</span>
                        <span class="text">#(package.text)</span>
                        <a href="#(package.link)">#(package.link_text)</a>
                    </div>
                </li>
            #endfor
        </ul>
        <a href=""></a>
    </div>
</div>
