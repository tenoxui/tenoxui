if (import.meta.env.MODE === 'development') {
  Promise.all([
    import('@anyframe/core'),
    import('../../anyframe.config.js')
    // Promise.resolve(import.meta.glob('/anyframe.config.js', { eager: true })['/anyframe.config.js'])
  ])
    .then(([{ AnyFrame }, config]) => {
      const styleTag = document.createElement('style')
      styleTag.textContent = new AnyFrame(config.default).create(
        [...document.querySelectorAll('*')].flatMap((element) =>
          element.getAttribute('class')?.split(/\s+/).filter(Boolean)
        ) || []
      )
      document.head.appendChild(styleTag)
    })
    .catch((error) => {
      console.error('Error loading AnyFrame:', error)
    })
}
