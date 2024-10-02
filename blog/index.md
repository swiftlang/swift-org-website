---
layout: new-layouts/blog
title: Blog
label: blog
atom: true
---

{% for post in site.posts %}
  <article id="{{ post.id }}" class="summary">
    <header>
      <h2 class="title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
      <time pubdate datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
    </header>
    <section class="excerpt">
      {{ post.excerpt }}

      <a href="{{ post.url }}">Read more...</a>
    </section>
  </article>
{% endfor %}
