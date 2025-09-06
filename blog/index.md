---
layout: new-layouts/base
title: Blog
---

<div class="blog">
  <div class="blog-swoop"></div>
  <div class="section blog-featured-grid">
    <div class="content">
      <h2 class="blog-featured-grid-headline">{{site.data.new-data.blog.page-data.headline}}</h2>
      {% assign hero_card_title = site.data.new-data.blog.page-data.category_titles[0] %}
      {% assign hero_card_post = site.categories[hero_card_title][0] %}
      {% assign hero_card_thumbnail = hero_card_post.thumbnail %}
      <div class="blog-featured-hero-card">
        <h3 class="blog-featured-grid-category-headline">{{hero_card_title}}</h3>
        {% if hero_card_thumbnail.url %}
          <img class="blog-featured-hero-card-image" src="{{ hero_card_thumbnail.url }}" alt="{{hero_card_thumbnail.alt}}" />
        {% endif %}
        <span class="blog-title">{{ hero_card_post.title }}</span>
        <time class="blog-date body-copy" pubdate datetime="{{ hero_card_post.date | date_to_xmlschema }}">{{ hero_card_post.date | date: "%B %-d, %Y" }}</time>
        <span class="blog-excerpt body-copy">{{ hero_card_post.excerpt | strip_html }}</span>
        <a class="blog-post-cta body-copy" href="{{ hero_card_post.url }}">{{site.data.new-data.blog.page-data.read-more}}</a>
      </div>
      <ul class="blog-featured-category-posts">
        {% for category_title in site.data.new-data.blog.page-data.category_titles %}
          {% if forloop.index0 > 0 %}
            {% assign latest_post = site.categories[category_title][0] %}
              <li>
                <h3 class="blog-featured-grid-category-headline">{{ category_title }}</h3>
                  <!-- <a class="news-item-link" href="{{ latest_post.url }}"> -->
                    <div class="blog-featured-category-post">
                        <span class="blog-title">{{ latest_post.title }}</span>
                        <time  class="blog-date body-copy" pubdate datetime="{{ latest_post.date | date_to_xmlschema }}">{{ latest_post.date | date: "%B %-d, %Y" }}</time>
                        <p class="blog-excerpt body-copy">{{ latest_post.excerpt | strip_html}}</p>
                        <a class="blog-post-cta" href="{{ post.url }}">{{site.data.new-data.blog.page-data.read-more}}</a>
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
        <span class="body-copy>">Categories</span>
        <span class="dropdown-toggle-arrow"></span>
      </button>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-header">
           <label>
            <input name="select-all" class="select-all" type="checkbox" value="select-all" checked><span class="checkbox-symbol"></span> <span class="dropdown-filter-text">All Categories</span>
          </label>
          <button class="dropdown-close" aria-label="Close"></button>
        </div>
        <hr>
        {% for category in site.data.new-data.blog.page-data.category_titles %}
          <label class="dropdown-filters">
            <input name="{{category}}" class="category-filter" type="checkbox" value="{{category}}" checked> <span class="check-symbol"></span> <span class="checkbox-symbol"></span> <span class="dropdown-filter-text">{{category}}</span>
          </label>
        {% endfor %}
    </div>
    </div>
    <div class="blogs-wrapper"></div>
    <script type="application/json" id="post-data">
      [
        {% for post in site.posts %}
          {
            "id": "{{ post.id | escape }}",
            "title": "{{ post.title | escape }}",
            "categories": {{ post.categories | jsonify }},
            "tags": {{ post.tags | jsonify }},
            "url": "{{ post.url | escape }}",
            "date": "{{ post.date | date: "%B %-d, %Y" }}",
            "excerpt": "{{ post.excerpt | strip_html | strip_newlines | escape }}"
            {% if post.image %}
              "image": "{{ post.image | jsonify }}",
            {% endif %}
          }{% if forloop.last == false %},{% endif %}
        {% endfor %}
      ]
    </script>
  </section>
</div>
