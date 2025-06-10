document.querySelectorAll('.carousel-container').forEach((container) => {
  const carousel = container.querySelector('.carousel')
  const items = container.querySelectorAll('.carousel-item')
  const prevBtn = container.querySelector('.prev-btn')
  const nextBtn = container.querySelector('.next-btn')
  const gap = 16
  const itemWidth = items[0].offsetWidth + gap
  const totalItems = items.length
  const visibleItems = 3
  const maxIndex = totalItems - visibleItems
  let currentIndex = 0

  function scrollToIndex(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex))

    carousel.scrollTo({
      left: currentIndex * itemWidth,
      behavior: 'smooth',
    })

    updateButtons()
  }

  function updateButtons() {
    const scrollLeft = carousel.scrollLeft
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth

    prevBtn.disabled = scrollLeft <= 0
    nextBtn.disabled = scrollLeft >= maxScrollLeft - 1
  }

  function updateIndexFromScroll() {
    const scrollLeft = carousel.scrollLeft

    currentIndex = Math.round(scrollLeft / itemWidth)
    updateButtons()
  }

  carousel.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateIndexFromScroll)
  })

  prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1))
  nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1))

  scrollToIndex(0)
})
