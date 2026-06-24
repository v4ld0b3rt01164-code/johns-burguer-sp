/*!
* Start Bootstrap - Business Casual v7.0.2 (https://startbootstrap.com/theme/business-casual)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {

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

    /* ===== HIGHLIGHT TODAY (hours) ===== */
    const listHoursArray = document.body.querySelectorAll('.list-hours li')
    if (listHoursArray.length > 0) {
        const today = new Date().getDay() - 1
        if (today >= 0 && today < listHoursArray.length) {
            listHoursArray[today].classList.add('today')
        }
    }
})
