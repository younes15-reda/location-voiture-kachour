/**
 * ====================================================================
 * KACHOUR ORAN — Script Principal & Animations Premium
 * Stack: Lenis (Smooth Scroll) + GSAP & ScrollTrigger
 * Registre visuel: Sobre Premium (Automotive / Car Rental)
 * Marché: Oran, Algérie
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------
  // 1. Accessibility & Environment Checks
  // ------------------------------------------------------------------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = window.innerWidth <= 768;

  // Register GSAP plugins if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ------------------------------------------------------------------
  // 2. Lenis Smooth Scrolling (Global Single Instance)
  // ------------------------------------------------------------------
  let lenis = null;

  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      infinite: false
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ------------------------------------------------------------------
  // 3. Navbar Scroll Effect & Mobile Menu
  // ------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        navMobile.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on navigation link click
    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------------------------------
  // 4. Hero Section Animations & Parallax (index.html)
  // ------------------------------------------------------------------
  const heroBg = document.getElementById('hero-bg');
  const heroSection = document.getElementById('hero');

  if (!prefersReduced && typeof gsap !== 'undefined') {
    // Parallax on Hero background (yPercent 15, smooth scrub)
    if (heroBg && heroSection && typeof ScrollTrigger !== 'undefined') {
      gsap.to(heroBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    // Hero content entrance timeline
    const heroTag = document.getElementById('hero-tag');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroDesc = document.getElementById('hero-desc');
    const heroActions = document.getElementById('hero-actions');

    if (heroTitle) {
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (heroBg) {
        heroTl.fromTo(heroBg, { scale: 1.12 }, { scale: 1.05, duration: 1.8, ease: 'power2.out' }, 0);
      }
      if (heroTag) {
        heroTl.fromTo(heroTag, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.75 }, 0.15);
      }
      if (heroTitle) {
        heroTl.fromTo(heroTitle, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.85 }, 0.3);
      }
      if (heroSubtitle) {
        heroTl.fromTo(heroSubtitle, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75 }, 0.45);
      }
      if (heroDesc) {
        heroTl.fromTo(heroDesc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.6);
      }
      if (heroActions) {
        heroTl.fromTo(heroActions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.75);
      }
    }
  }

  // ------------------------------------------------------------------
  // 5. ScrollTrigger Scroll Reveals (fade + translateY 28px, expo.out)
  // ------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    if (prefersReduced) {
      // If user prefers reduced motion, reveal everything immediately
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    } else {
      // Grids with staggered items (features, cars, testimonials, etc.)
      const gridSelectors = [
        '.features-grid > .card',
        '.cars-grid > .card',
        '.cars-full-grid > .card',
        '.testimonials-grid > .card',
        '.stats-grid > div',
        '.guarantees-list > .guarantee-item',
        '.contact-info-list > .contact-info-item',
        '.car-select-grid > .car-select-card'
      ];

      gridSelectors.forEach((selector) => {
        const items = document.querySelectorAll(selector);
        if (items.length > 0) {
          ScrollTrigger.batch(items, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) => {
              gsap.fromTo(batch,
                { opacity: 0, y: 28 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.75,
                  stagger: 0.1,
                  ease: 'expo.out',
                  overwrite: 'auto'
                }
              );
            }
          });
        }
      });

      // Standalone section headers, info banners, CTA blocks
      const standaloneElements = document.querySelectorAll(`
        .section-header,
        .quick-book,
        .info-banner,
        .cta-section .reveal,
        .page-header .reveal,
        .booking-card,
        .contact-form-card,
        .map-placeholder,
        #wa-cta-card
      `);

      standaloneElements.forEach((el) => {
        // Skip if inside a hero (handled by hero timeline)
        if (el.closest('#hero')) return;

        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true
            }
          }
        );
      });
    }
  } else {
    // Fallback if GSAP is not loaded
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
      el.classList.add('visible');
    });
  }

  // ------------------------------------------------------------------
  // 6. Magnetic CTA Buttons (Desktop only, amplitude ~8px max)
  // ------------------------------------------------------------------
  if (isFinePointer && !prefersReduced && typeof gsap !== 'undefined') {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-whatsapp, #nav-cta-btn, #hero-reserve-btn, #airport-call-btn');

    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Max translation ~8px
        const maxDist = 8;
        const moveX = (deltaX / (rect.width / 2)) * maxDist;
        const moveY = (deltaY / (rect.height / 2)) * maxDist;

        gsap.to(btn, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // ------------------------------------------------------------------
  // 7. Counter Animation for Stats (Triggered by ScrollTrigger)
  // ------------------------------------------------------------------
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length > 0) {
    if (!prefersReduced && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#stats',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          counters.forEach((el) => {
            const target = parseInt(el.dataset.target, 10);
            if (!target) return;

            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.floor(counterObj.val) + '+';
              }
            });
          });
        }
      });
    } else {
      counters.forEach((el) => {
        const target = el.dataset.target;
        if (target) el.textContent = target + '+';
      });
    }
  }

  // ------------------------------------------------------------------
  // 8. Toast Helper Utility
  // ------------------------------------------------------------------
  window.showToast = function(msg, icon = '✅') {
    const toast = document.getElementById('toast') || document.getElementById('admin-toast');
    if (!toast) return;

    const msgEl = document.getElementById('toast-msg') || document.getElementById('admin-toast-msg');
    const iconEl = document.getElementById('toast-icon');

    if (msgEl) msgEl.textContent = msg;
    if (iconEl) iconEl.textContent = icon;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };
});
