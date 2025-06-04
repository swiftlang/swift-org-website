const heroAnimation = async (animContainer) => {
  const isReduceMotionEnabled = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const urlParams = new URLSearchParams(location.search)
  const hasDebugParam = urlParams.has('debug')

  async function loadImage(url) {
    const el = new Image()
    return new Promise((resolve, reject) => {
      el.onload = () => resolve(el)
      el.onerror = (err) => reject(err)
      el.src = url
    })
  }

  // Skip to visible portion of animation when cropped on small screens
  const { left, width } = animContainer.getClientRects()[0]
  const offScreenDelta = Math.abs(left) / width

  const heroSwoops = [
    {
      canvas: document.querySelector('#purple-swoop'),
      path: 'M-34 860C-34 860 42 912 102 854C162 796 98 658 50 556C2 454 18 48 142 88C272 130 290 678 432 682C574 686 434 102 794 90C1009 83 1028 280 1028 280',
      pathLength: 2776,
      anchorPoints: [558, 480.5],
      position: [558, 640.5],
      imagePath: '/assets/images/landing-page/hero/purple-swoop.png',
      lineWidth: 210,
      debugColor: 'purple',
      image: null,
      state: { progress: offScreenDelta },
    },
    {
      canvas: document.querySelector('#white-swoop-1'),
      path: 'M-26 910C-26 910 209 817 90 542C38 422 -87 99 102 62C294 24 226 454 397 650C540 812 530 398 567 228C600 84 764 -94 1182 320',
      pathLength: 3015.6103515625,
      anchorPoints: [600, 456],
      position: [600, 652],
      imagePath: '/assets/images/landing-page/hero/white-swoop-1.png',
      lineWidth: 140,
      debugColor: 'red',
      image: null,
      state: { progress: offScreenDelta },
    },
    {
      canvas: document.querySelector('#white-swoop-2'),
      path: ' M-59,796.5009765625 C-59,796.5009765625 258.5199890136719,885.5130004882812 361,430.5 C461,-13.5 757,18.5 903,44.5 C1049,70.5 1123,166.5 1167,228.5',
      pathLength: 1716,
      anchorPoints: [595, 417],
      position: [594, 508.5],
      imagePath: '/assets/images/landing-page/hero/white-swoop-2.png',
      lineWidth: 73.6,
      debugColor: 'cyan',
      image: null,
      state: { progress: offScreenDelta },
    },
    {
      canvas: document.querySelector('#orange-swoop-bottom'),
      path: 'M-74 816C-74 816 216 887 326 598C408 382 458 170 634 180C809 190 851 305 904 368C972 448 1124 476 1124 476',
      pathLength: 1651,
      anchorPoints: [610, 455.5],
      position: [610, 479.5],
      imagePath: '/assets/images/landing-page/hero/orange-swoop-bottom.png',
      lineWidth: 202.2,
      debugColor: 'yellow',
      image: null,
      state: { progress: offScreenDelta },
    },
    {
      canvas: document.querySelector('#orange-swoop-top'),
      path: 'M468 168C468 168 674 46 858 78C1018 106 1116 142 1160 414',
      pathLength: 906,
      anchorPoints: [610, 455.5],
      position: [610, 479.5],
      imagePath: '/assets/images/landing-page/hero/orange-swoop-top.png',
      lineWidth: 163.4,
      debugColor: 'green',
      image: null,
      state: { progress: offScreenDelta },
    },
  ]
  const logo = {
    canvas: document.querySelector('#bird'),
    positionStart: [899.2, 202.5],
    positionEnd: [1084, 388],
    anchorPoints: [304, 268.5],
    position: [610, 672.5],
    imagePath: '/assets/images/landing-page/hero/bird.png',
    image: null,
    state: { progress: offScreenDelta },
  }

  const initSwoops = ({
    path,
    pathLength,
    position: [posX, posY],
    lineWidth,
    debugColor,
    canvas,
    image,
  }) => {
    const ctx = canvas.getContext('2d')
    // The reference animation's transform origin is in the center of the canvas
    // We're not going to reset this as it will make pulling values directly from AE easier
    ctx.translate(posX - image.naturalWidth / 2, posY - image.naturalHeight / 2)
    // Set mask styles
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    let pathInstance = new Path2D(path)

    if (!isReduceMotionEnabled) {
      ctx.setLineDash([pathLength])
      ctx.lineDashOffset = pathLength

      if (hasDebugParam) {
        ctx.strokeStyle = debugColor
        ctx.stroke(pathInstance)
      }
    } else {
      ctx.drawImage(image, 0, 0)
    }

    return { ctx, pathInstance }
  }

  const initLogo = ({
    canvas,
    image,
    positionStart: [posX, posY],
    positionEnd: [endX, endY],
  }) => {
    const ctx = canvas.getContext('2d')
    // Applying this conversion for the same purpose as init swoops
    ctx.translate(posX - image.naturalWidth / 2, posY - image.naturalHeight / 2)

    if (isReduceMotionEnabled) {
      ctx.globalAlpha = 1
      const deltaX = endX - posX
      const deltaY = endY - posY
      ctx.drawImage(image, deltaX, deltaY)
    }

    return ctx
  }

  try {
    // Load swoop images
    const swoopImages = await Promise.all(
      heroSwoops.map((swoop) => loadImage(swoop.imagePath)),
    )
    // Load logo
    const logoImage = await loadImage(logo.imagePath)

    logo.image = logoImage
    // Init canvas for each swoop layer
    heroSwoops.forEach((swoop, i) => {
      swoop.image = swoopImages[i]
      const canvasData = initSwoops(swoop)
      swoop.ctx = canvasData.ctx
      swoop.pathInstance = canvasData.pathInstance
    })
    // Init logo canvas
    logo.ctx = initLogo(logo)
  } catch (error) {
    console.error('Error loading images:', error)
    throw error
  }

  // Skip animation if reduced motion is enabled
  if (isReduceMotionEnabled) {
    return
  }

  const DURATION = 1000 - 1000 * offScreenDelta

  const tl = anime.createTimeline({
    defaults: { duration: DURATION, ease: 'inOut(1.2)' },
  })

  tl.label('start', 0)

  const swoopUpdate = ({
    state,
    ctx,
    pathLength,
    pathInstance,
    image,
    canvas,
  }) => {
    // Clear canvas before next draw
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Progress line dash offset
    ctx.lineDashOffset = pathLength * (1 - state.progress)
    // Draw stroke
    ctx.stroke(pathInstance)
    // Source-in will allow us to only draw as far as the stroke
    ctx.globalCompositeOperation = 'source-in'
    ctx.drawImage(image, 0, 0)
    // Reset to default for our next stroke paint
    ctx.globalCompositeOperation = 'source-out'
  }

  // White swoop 1
  tl.add(
    heroSwoops[1].state,
    {
      progress: 1,
      duration: 950 - 950 * offScreenDelta,
      onUpdate: () => swoopUpdate(heroSwoops[1]),
    },
    'start',
  )
  // Purple swoop
  tl.add(
    heroSwoops[0].state,
    {
      progress: 1,
      duration: 950 - 950 * offScreenDelta,
      onUpdate: () => swoopUpdate(heroSwoops[0]),
    },
    'start',
  )
  // White swoop 2
  tl.add(
    heroSwoops[2].state,
    {
      progress: 1,
      onUpdate: () => swoopUpdate(heroSwoops[2]),
    },
    'start',
  )
  // Orange swoop bottom
  tl.add(
    heroSwoops[3].state,
    {
      progress: 1,
      onUpdate: () => swoopUpdate(heroSwoops[3]),
    },
    'start',
  )
  // Orange top
  tl.add(
    heroSwoops[4].state,
    {
      progress: 1,
      duration: 480 - 480 * offScreenDelta,
      delay: 520 - 520 * offScreenDelta,
      onUpdate: () => swoopUpdate(heroSwoops[4]),
    },
    'start',
  )
  // Logo
  tl.add(
    logo.state,
    {
      ease: 'out(2)',
      duration: 200 - 200 * offScreenDelta,
      delay: 750 - 750 * offScreenDelta,
      progress: 1,
      onUpdate: () => {
        const {
          state: { progress },
          ctx,
          image,
          canvas,
          positionStart: [startX, startY],
          positionEnd: [endX, endY],
        } = logo
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // Progresses logo opacity from 0 to 1
        ctx.globalAlpha = progress
        const deltaX = (endX - startX) * progress
        const deltaY = (endY - startY) * progress
        ctx.drawImage(image, deltaX, deltaY)
      },
    },
    'start',
  )
}

// Start animation when container is mounted
const observer = new MutationObserver(() => {
  const animContainer = document.querySelector('.animation-container')
  if (animContainer) {
    observer.disconnect()
    heroAnimation(animContainer)
  }
})

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
})
