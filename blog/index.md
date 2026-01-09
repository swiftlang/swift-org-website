---
layout: new-layouts/base
title: Blog
---

<div class="blog">
  <div class="blog-swoop"></div>
  <div class="section blog-featured-grid">
    <div class="content">
      <h2 class="blog-featured-grid-headline title-1">{{site.data.new-data.blog.page-data.headline}}</h2>
      {% assign hero_card_title = site.data.new-data.blog.page-data.category_titles[0] %}
      {% assign hero_card_post = site.categories[hero_card_title][0] %}
      {% assign hero_card_thumbnail = hero_card_post.featured-image %}
      {% assign hero_card_thumbnail_dark = hero_card_post.featured-image-dark %}
      <h3 class="blog-featured-grid-category-headline title-3">{{hero_card_title}}</h3>
      <div class="blog-featured-hero-card {% if hero_card_thumbnail.url %} blog-featured-hero-card-with-image {% endif %}">
        {% if hero_card_thumbnail.url %}
          <img class="blog-featured-hero-card-image {% if hero_card_thumbnail_dark.url %}hide-dark{% endif %}" src="{{ hero_card_thumbnail.url }}" alt="{{hero_card_thumbnail.alt}}" />
        {% endif %}
        {% if hero_card_thumbnail_dark.url %}
          <img class="blog-featured-hero-card-image hide-light" src="{{ hero_card_thumbnail_dark.url }}" alt="{{hero_card_thumbnail_dark.alt}}" />
        {% endif %}
        <span class="blog-title title-4">{{ hero_card_post.title }}</span>
        <time class="blog-date body" pubdate datetime="{{ hero_card_post.date | date_to_xmlschema }}">{{ hero_card_post.date | date: "%B %-d, %Y" }}</time>
        <span class="blog-excerpt body">{{ hero_card_post.excerpt | strip_html }}</span>
        <a class="blog-post-cta body" href="{{ hero_card_post.url }}">{{site.data.new-data.blog.page-data.read-more}}</a>
      </div>
      <ul class="blog-featured-category-posts">
        {% for category_title in site.data.new-data.blog.page-data.category_titles %}
          {% if forloop.index0 > 0 %}
            {% assign latest_post = site.categories[category_title][0] %}
              <li>
                <h3 class="blog-featured-grid-category-headline title-3">{{ category_title }}</h3>
                  <!-- <a class="news-item-link" href="{{ latest_post.url }}"> -->
                    <div class="blog-featured-category-post">
                        <span class="blog-title title-4">{{ latest_post.title }}</span>
                        <time  class="blog-date body" pubdate datetime="{{ latest_post.date | date_to_xmlschema }}">{{ latest_post.date | date: "%B %-d, %Y" }}</time>
                        <p class="blog-excerpt body">{{ latest_post.excerpt | strip_html}}</p>
                        <a class="blog-post-cta body" href="{{ latest_post.url }}">{{site.data.new-data.blog.page-data.read-more}}</a>
                    </div>
                  <!-- </a> -->
              </li>
          {% endif %}
        {% endfor %}
      </ul>
    </div>
  </div>
  <section class="blogs-and-filter-wrapper content">
    <div class="dropdown blogs-filter">
      <button class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="dropdown-menu">
        <span class="body">Categories</span>
        <span class="dropdown-toggle-arrow"></span>
      </button>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-header">
           <label>
            <input disabled name="select-all" class="select-all" type="checkbox" value="select-all" checked="true">
            <span class="checkbox-symbol"></span> <span>All Categories</span>
          </label>
        </div>
        <hr>
        {% for category in site.data.new-data.blog.page-data.category_titles %}
          <label 
            >
          <input name="{{category}}" class="category-filter body" type="checkbox" value="{{category}}" checked>
           <span></span> <span class="checkbox-symbol"></span> <span>{{category}}</span>
          </label>
        {% endfor %}
    </div>
    </div>
    <div class="blogs-wrapper"></div>
    <script type="application/json" id="post-data">
      [{% for post in site.posts %}
          {
            "id": "{{ post.id | escape }}",
            "title": "{{ post.title | escape }}",
            "categories": {{ post.categories | jsonify }},
            "url": "{{ post.url | escape }}",
            "date": "{{ post.date | date: "%B %-d, %Y" }}",
            "excerpt": "{{ post.excerpt | strip_html | strip_newlines | escape }}"{% if post.featured-image %},
            "image-url": "{{ post.featured-image.url | escape }}", 
            "image-alt": "{{ post.featured-image.alt }}"
            {% endif %}
          }{% if forloop.last == false %},{% endif %}{% endfor %}]
    </script>
  </section>
</div>
