---
layout: new-layouts/base
title: Community
---

<div class="community">
   <div class="community-swoop-1"></div>
   <div class="section community-featured-grid">
      <div class="content">
         <h2 class="community-featured-grid-headline">
            {{ site.data.new-data.community.page-data.headline }}
         </h2>

         <p class="section-text">
            {{ site.data.new-data.community.page-data.text }}
         </p>
      </div>
   </div>
   <div class="section community-section-grid">
      <div class="content">
         <h2 class="community-section-grid-headline">
            {{ site.data.new-data.community.page-data.section2.headline }}
         </h2>

         <p class="section-text">
            {{ site.data.new-data.community.page-data.section2.text }}
         </p>

         <ul class="community-section-cards">
         {% for card in site.data.new-data.community.page-data.section2.cards %}
               <li>
                  <a class="card-link" href="{{ card.link }}">
                  <h3 class="community-card-headline">{{ card.title }}</h3>
                     <p class="body-copy">{{ card.text }}</p>
                     <p class="card-cta">{{site.data.new-data.community.page-data.read-more}}</p>
                  </a>
               </li>
         {% endfor %}
         </ul>
      </div>
   </div>
   {% include new-includes/components/headline-section.html content=site.data.new-data.community.page-data.section3 %}
   <div class="section community-section-grid">
      <div class="content">
         <h2 class="community-section-grid-headline">
            {{ site.data.new-data.community.page-data.section4.headline }}
         </h2>

         <p class="section-text">
            {{ site.data.new-data.community.page-data.section4.text }}
         </p>

         <ul class="community-section-cards">
         {% for card in site.data.new-data.community.page-data.section4.cards %}
               <li>
                  <a class="card-link" href="{{ card.link }}">
                  <h3 class="community-card-headline">{{ card.title }}</h3>
                     <p class="body-copy">{{ card.text }}</p>
                     <p class="card-cta">{{site.data.new-data.community.page-data.read-more}}</p>
                  </a>
               </li>
         {% endfor %}
         </ul>
      </div>
   </div>
   <div class="section community-section-grid">
      <h2 class="community-section-grid-headline">
         {{ site.data.new-data.community.page-data.section5.headline }}
      </h2>
      <div class="content links">
         <ul class="community-section-links">
         {% for card in site.data.new-data.community.page-data.section5.links %}
            <li>
               <a href="{{ card.link }}" class="link-card">
                  <img src="{{ card.image.light }}" alt="{{ card.alt }}" class="link-card-image hide-dark">
                  <img src="{{ card.image.dark }}" alt="{{ card.alt }}" class="link-card-image hide-light">
                  <span class="link-card-text">{{ card.label }}</span>
               </a>
            </li>
         {% endfor %}
         </ul>
      </div>
   </div>
</div>
