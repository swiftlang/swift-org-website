const heroAnimation = async () => {
  const isReduceMotionEnabled = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      state: { progress: 0 },
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
      state: { progress: 0 },
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
      state: { progress: 0 },
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
      state: { progress: 0 },
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
      state: { progress: 0 },
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
    state: { progress: 0 },
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
    // Convert position value to account for the center anchor point in AE
    // We're not going to reset this as it will make pulling values directly from AE easier
    ctx.translate(posX - image.naturalWidth / 2, posY - image.naturalHeight / 2)
    // Set mask styles
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    // Convert SVG path pulled from AE masks
    let pathInstance = new Path2D(path)

    ctx.setLineDash([pathLength])
    ctx.lineDashOffset = pathLength

    if (hasDebugParam) {
      ctx.strokeStyle = debugColor
      ctx.stroke(pathInstance)
    }
    return { ctx, pathInstance }
  }

  const initLogo = ({ canvas, image, positionStart: [posX, posY] }) => {
    const ctx = canvas.getContext('2d')
    ctx.globalAlpha = 0
    // Same reason for conversion as initSwoops
    ctx.translate(posX - image.naturalWidth / 2, posY - image.naturalHeight / 2)

    ctx.drawImage(image, 0, 0)

    return ctx
  }

  try {
    // load swoop image
    const swoopImages = await Promise.all(
      heroSwoops.map((swoop) => loadImage(swoop.imagePath)),
    )
    // load logo
    const logoImage = await loadImage(logo.imagePath)

    logo.image = logoImage
    // init canvas for each swoop layer
    heroSwoops.forEach((swoop, i) => {
      swoop.image = swoopImages[i];
      const canvasData = initSwoops(swoop);
      swoop.ctx = canvasData.ctx;
      swoop.pathInstance = canvasData.pathInstance;
    });
    // init logo canvas
    logo.ctx = initLogo(logo)
  } catch (error) {
    console.error('Error loading images:', error)
    throw error
  }

  if (isReduceMotionEnabled) {
    // Render final state immediately
    heroSwoops.forEach((swoop) => {
      const { ctx, pathInstance, image, canvas } = swoop;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineDashOffset = 0;
      ctx.stroke(pathInstance);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(image, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    });

    const {
      ctx,
      image,
      canvas,
      positionStart: [startX, startY],
      positionEnd: [endX, endY],
    } = logo;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    ctx.drawImage(image, deltaX, deltaY);
    return;
  }

  const DURATION = 1000

  const tl = anime.createTimeline({
    defaults: { duration: DURATION, ease: 'inOut(.8)' },
  })

  tl.label('start', 0)

  // white swoop 1
  tl.add(
    heroSwoops[1].state,
    {
      progress: 1,
      duration: 950,
      onUpdate: () => {
        const { state, ctx, pathLength, pathInstance, image, canvas } =
          heroSwoops[1]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineDashOffset = pathLength * (1 - state.progress)
        ctx.stroke(pathInstance)
        ctx.globalCompositeOperation = 'source-in'
        ctx.drawImage(image, 0, 0)
        ctx.globalCompositeOperation = 'source-out'
      },
    },
    'start',
  )
  //   // purple swoop
  tl.add(
    heroSwoops[0].state,
    {
      progress: 1,
      duration: 950,
      onUpdate: () => {
        const { state, ctx, pathLength, pathInstance, image, canvas } =
          heroSwoops[0]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineDashOffset = pathLength * (1 - state.progress)
        ctx.stroke(pathInstance)
        ctx.globalCompositeOperation = 'source-in'
        ctx.drawImage(image, 0, 0)
        ctx.globalCompositeOperation = 'source-out'
      },
    },
    'start',
  )
  //   // white swoop 2 swoop
  tl.add(
    heroSwoops[2].state,
    {
      progress: 1,
      onUpdate: () => {
        const { state, ctx, pathLength, pathInstance, image, canvas } =
          heroSwoops[2]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineDashOffset = pathLength * (1 - state.progress)
        ctx.stroke(pathInstance)
        ctx.globalCompositeOperation = 'source-in'
        ctx.drawImage(image, 0, 0)
        ctx.globalCompositeOperation = 'source-out'
      },
    },
    'start',
  )
  //   // orange swoop bottom
  tl.add(
    heroSwoops[3].state,
    {
      progress: 1,
      onUpdate: () => {
        const { state, ctx, pathLength, pathInstance, image, canvas } =
          heroSwoops[3]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineDashOffset = pathLength * (1 - state.progress)
        ctx.stroke(pathInstance)
        ctx.globalCompositeOperation = 'source-in'
        ctx.drawImage(image, 0, 0)
        ctx.globalCompositeOperation = 'source-out'
      },
    },
    'start',
  )
  // orange top
  tl.add(
    heroSwoops[4].state,
    {
      progress: 1,
      // ease: 'inOutQuad',
      duration: 480,
      delay: 520,
      onUpdate: () => {
        const { state, ctx, pathLength, pathInstance, image, canvas } =
          heroSwoops[4]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.lineDashOffset = pathLength * (1 - state.progress)
        ctx.stroke(pathInstance)
        ctx.globalCompositeOperation = 'source-in'
        ctx.drawImage(image, 0, 0)
        ctx.globalCompositeOperation = 'source-out'
      },
    },
    'start',
  )
  // logo
  tl.add(
    logo.state,
    {
      ease: 'out(1.1)',
      duration: 250,
      delay: 750,
      progress: 1,
      // ease: 'inOutQuad',
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
        ctx.globalAlpha = progress
        const deltaX = (endX - startX) * progress
        const deltaY = (endY - startY) * progress
        ctx.drawImage(image, deltaX, deltaY)
      },
    },
    'start',
  )
}

const observer = new MutationObserver(() => {
  if (document.querySelector('.animation-container')) {
    observer.disconnect()
    heroAnimation()
  }
})

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
})
