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

         {% assign hero_card_1 = site.data.new-data.community.page-data.hero-cards[0] %}
         {% assign hero_card_1_image = hero_card_1.image %}

         <img
            class="community-featured-hero-card-image hide-dark"
            src="{{ hero_card_1_image.light }}"
            alt="{{ hero_card_1.alt }}"
         />
         <img
            class="community-featured-hero-card-image hide-light"
            src="{{ hero_card_1_image.dark }}"
            alt="{{ hero_card_1.alt }}"
         />

         <div class="community-sub-featured">
            <div class="hero-card-2">
               {% assign hero_card_2 = site.data.new-data.community.page-data.hero-cards[1] %}
               {% assign hero_card_2_image = hero_card_2.image %}

               <a href="{{ hero_card_2.link.link }}">
                  <img
                     class="community-featured-hero-card-image with-zoom hide-dark"
                     src="{{ hero_card_2_image.light }}"
                     alt="{{ hero_card_2.alt }}"
                  />
                  <img
                     class="community-featured-hero-card-image with-zoom hide-light"
                     src="{{ hero_card_2_image.dark }}"
                     alt="{{ hero_card_2.alt }}"
                  />
               </a>

               <h3 class="community-sub-featured-grid-headline">
                  {{ hero_card_2.label }}
               </h3>
               <p class="body-copy">{{ hero_card_2.text | strip_html}}</p>
               <a class="card-link" href="{{ hero_card_2.link.url }}">
                  <p class="card-cta" href="{{ hero_card_2.link.url }}">{{hero_card_2.link.text}}</p>
               </a>
            </div>
            <div class="hero-card-3">
               {% assign hero_card_3 = site.data.new-data.community.page-data.hero-cards[2] %}
               {% assign hero_card_3_image = hero_card_3.image %}

               <a href="{{ hero_card_3.link.link }}">
                  <img
                     class="community-featured-hero-card-image with-zoom hide-dark"
                     src="{{ hero_card_3_image.light }}"
                     alt="{{ hero_card_3.alt }}"
                  />
                  <img
                     class="community-featured-hero-card-image with-zoom hide-light"
                     src="{{ hero_card_3_image.dark }}"
                     alt="{{ hero_card_3.alt }}"
                  />
               </a>

               <h3 class="community-sub-featured-grid-headline">
                  {{ hero_card_3.label }}
               </h3>
               <p class="body-copy">{{ hero_card_3.text | strip_html}}</p>
               <a class="card-link" href="{{ hero_card_3.link.url }}">
                  <p class="card-cta" href="{{ hero_card_3.link.url }}">{{hero_card_3.link.text}}</p>
               </a>
            </div>
         </div>
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
                     <p class="body-copy">{{ card.text | strip_html}}</p>
                     <p class="card-cta" href="{{ latest_post.url }}">{{site.data.new-data.community.page-data.read-more}}</p>
                  </a>
               </li>
         {% endfor %}
         </ul>
      </div>
   </div>
   <div class="section community-section-grid">
      <div class="content">
         <h2 class="community-section-grid-headline">
            {{ site.data.new-data.community.page-data.section3.headline }}
         </h2>

         <p class="section-text">
            {{ site.data.new-data.community.page-data.section3.text }}
         </p>

         <ul class="community-section-cards">
         {% for card in site.data.new-data.community.page-data.section3.cards %}
               <li>
                     <a class="card-link" href="{{ card.link }}">
                     <h3 class="community-card-headline">{{ card.title }}</h3>
                        <p class="body-copy">{{ card.text | strip_html}}</p>
                        <p class="card-cta" href="{{ latest_post.url }}">{{site.data.new-data.community.page-data.read-more}}</p>
                     </a>
               </li>
         {% endfor %}
         </ul>
      </div>
   </div>
   <div class="section community-section-grid">
      <h2 class="community-section-grid-headline">
         {{ site.data.new-data.community.page-data.section4.headline }}
      </h2>
      <div class="content links">
         <ul class="community-section-links">
         {% for card in site.data.new-data.community.page-data.section4.links %}
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
