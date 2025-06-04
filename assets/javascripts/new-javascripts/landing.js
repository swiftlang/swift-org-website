const urlParams = new URLSearchParams(location.search)
const hasDebugParam = urlParams.has('debug')
const reduceMotion = document.body.classList.contains('reduced-motion')

// Scroll Animations

const swoops = document.querySelectorAll('.swoop-anim')
const swoopAniVars = [
  { backgroundPosition: '67.5% 0%' },
  { backgroundPosition: '80% 0%' },
  { backgroundPosition: '60% 0%' },
]

swoops.forEach((el, i) => {
  anime.animate(el, {
    autoplay: anime.onScroll({
      axis: 'y',
      debug: hasDebugParam,
      enter: 'bottom - 100%',
      container: 'body',
      target: el,
      onEnter: () => {
        el.classList.add('visible')
      },
    }),
  })
  if (!reduceMotion) {
    anime.animate(el, {
      ...swoopAniVars[i],
      autoplay: anime.onScroll({
        container: 'body',
        enter: { target: 'top-=50%', container: 'bottom-=50%' },
        leave: { target: 'bottom-=50%', container: 'top-=50%' },
        sync: 0.1,
        debug: hasDebugParam,
      }),
    })
  }
})
