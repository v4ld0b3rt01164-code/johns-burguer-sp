import './style.css'

document.addEventListener('DOMContentLoaded', () => {

  /* ===== HERO VIDEO SCRUB ===== */
  const heroTrack = document.getElementById('hero-track')
  const heroSection = document.getElementById('hero-section')
  const vids = {
    pc: document.getElementById('hero-video-pc'),
    mobile: document.getElementById('hero-video-mobile'),
  }

  if (heroTrack && heroSection && vids.pc && vids.mobile) {
    const trackHeight = window.innerHeight * 3
    heroTrack.style.height = trackHeight + 'px'

    const loadBar = document.getElementById('load-bar')
    const loadPct = document.getElementById('load-pct')
    const loading = document.getElementById('hero-loading')

    vids.pc.src = vids.pc.dataset.src
    vids.mobile.src = vids.mobile.dataset.src

    const activeVideo = () => getComputedStyle(vids.pc).display !== 'none' ? vids.pc : vids.mobile

    let loaded = { pc: false, mobile: false }
    const hideLoad = (vid) => {
      const key = vid === vids.pc ? 'pc' : 'mobile'
      if (loaded[key]) return
      loaded[key] = true
      if (loaded.pc && loaded.mobile) {
        loading.style.opacity = '0'
        setTimeout(() => { loading.style.display = 'none' }, 500)
      }
    }
    vids.pc.addEventListener('canplay', () => hideLoad(vids.pc))
    vids.pc.addEventListener('loadeddata', () => hideLoad(vids.pc))
    vids.mobile.addEventListener('canplay', () => hideLoad(vids.mobile))
    vids.mobile.addEventListener('loadeddata', () => hideLoad(vids.mobile))

    setInterval(() => {
      const v = activeVideo()
      if (v.readyState >= 2) { hideLoad(v); return }
      if (v.buffered.length > 0) {
        const pct = Math.round((v.buffered.end(0) / v.duration) * 100)
        loadBar.style.width = pct + '%'
        if (loadPct) loadPct.textContent = String(pct)
      }
    }, 200)

    const seekFirst = (v) => { v.addEventListener('loadedmetadata', () => { v.currentTime = 0 }, { once: true }) }
    seekFirst(vids.pc)
    seekFirst(vids.mobile)

    const tick = () => {
      const rect = heroTrack.getBoundingClientRect()
      const max = heroTrack.offsetHeight - window.innerHeight
      const p = max <= 0 ? 0 : Math.max(0, Math.min(1, -rect.top / max))

      const v = activeVideo()
      if (v.duration && v.readyState >= 2) {
        v.currentTime = p * v.duration
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  /* ===== SCROLL ARROW ===== */
  const scrollArrow = document.getElementById('scroll-arrow')
  if (scrollArrow) {
    const hideArrow = () => {
      requestAnimationFrame(() => scrollArrow.classList.add('hidden'))
      window.removeEventListener('scroll', hideArrow)
    }
    window.addEventListener('scroll', hideArrow, { passive: true, once: true })
  }

  /* ===== NAV SCROLL ===== */
  const nav = document.getElementById('mainNav')
  const navLinks = document.querySelectorAll('.nav-link')
  const sections = document.querySelectorAll('[data-section]')

  const onScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }

    let current = ''
    sections.forEach(section => {
      const top = section.offsetTop - 120
      if (window.scrollY >= top) {
        current = section.getAttribute('data-section')
      }
    })
    navLinks.forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active')
      }
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ===== MOBILE MENU ===== */
  const menuToggle = document.getElementById('menuToggle')
  const mobileNav = document.getElementById('mobileNav')
  const mobileOverlay = document.getElementById('mobileOverlay')

  const closeMenu = () => {
    menuToggle.classList.remove('active')
    mobileNav.classList.remove('open')
    mobileOverlay.classList.remove('open')
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open')
      if (isOpen) {
        closeMenu()
      } else {
        menuToggle.classList.add('active')
        mobileNav.classList.add('open')
        mobileOverlay.classList.add('open')
      }
    })
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu)
  }

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMenu)
  })

  /* ===== SCROLL REVEAL ===== */
  const reveals = document.querySelectorAll('.reveal')
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.15 })

    reveals.forEach(el => observer.observe(el))
  }

  /* ===== SCROLL TO TOP ===== */
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
})
