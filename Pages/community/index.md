---
template: bare
title: Community
contentTemplating: true
---

<div class="community">
   <div class="community-swoop-1"></div>
   <div class="section community-featured-grid">
      <div class="content">
         <h2 class="community-featured-grid-headline title-0">
            #unsafeHTML(data.new_data.community.page_data.headline)
         </h2>

         <p class="section-text">
            #unsafeHTML(data.new_data.community.page_data.text)
         </p>
      </div>
   </div>
   <div class="section community-section-grid">
      <div class="content">
         <h2 class="community-section-grid-headline title-1">
            #unsafeHTML(data.new_data.community.page_data.section2.headline)
         </h2>

         <p class="section-text">
            #unsafeHTML(data.new_data.community.page_data.section2.text)
         </p>

         <ul class="content-card-grid">
         #for(card in data.new_data.community.page_data.section2.cards):
               <li>
                  
<div class="content-card">
  <span class="content-card-title title-4">#(card.title)</span>
  #if(false):
  <time
    class="content-card-date body"
    pubdate
    datetime=""
    ></time
  >
  #endif
  <p class="content-card-excerpt body">#stripHTML(card.text)</p>
  <a class="content-card-cta body" href="#(card.link)"
    >#if(data.new_data.community.page_data.read_more):#(data.new_data.community.page_data.read_more)#else:Read more#endif</a
  >
</div>

               </li>
         #endfor
         </ul>
      </div>
   </div>
   #extend("partials/components/headline-section", boxed.new_data.community.page_data.section3)
   <div class="section community-section-grid">
      <div class="content">
         <h2 class="community-section-grid-headline title-1">
            #unsafeHTML(data.new_data.community.page_data.section4.headline)
         </h2>

         <p class="section-text">
            #unsafeHTML(data.new_data.community.page_data.section4.text)
         </p>

         <ul class="content-card-grid">
         #for(card in data.new_data.community.page_data.section4.cards):
               <li>
                  
<div class="content-card">
  <span class="content-card-title title-4">#(card.title)</span>
  #if(false):
  <time
    class="content-card-date body"
    pubdate
    datetime=""
    ></time
  >
  #endif
  <p class="content-card-excerpt body">#stripHTML(card.text)</p>
  <a class="content-card-cta body" href="#(card.link)"
    >#if(data.new_data.community.page_data.read_more):#(data.new_data.community.page_data.read_more)#else:Read more#endif</a
  >
</div>

               </li>
         #endfor
         </ul>
      </div>
   </div>
   <div class="section community-section-grid">
      <div class="content links">
         <h2 class="community-section-grid-headline title-1">
            #unsafeHTML(data.new_data.community.page_data.section5.headline)
         </h2>
         <ul class="community-section-links">
         #for(card in data.new_data.community.page_data.section5.links):
            <li>
               <a href="#(card.link)" class="link-card">
                  <img src="#(card.image.light)" alt="#(card.alt)" class="link-card-image hide-dark">
                  <img src="#(card.image.dark)" alt="#(card.alt)" class="link-card-image hide-light">
                  <span class="link-card-text">#(card.label)</span>
               </a>
            </li>
         #endfor
         </ul>
      </div>
   </div>
</div>
