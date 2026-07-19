document.addEventListener('DOMContentLoaded', function () {
  function setupArchitectureFlow() {
    const card = document.querySelector('.architecture-card');
    if (!card) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let isNearViewport = false;

    function syncFlowState() {
      card.classList.toggle('is-flowing', isNearViewport && !document.hidden);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        isNearViewport = entries.some(function (entry) {
          return entry.isIntersecting;
        });
        syncFlowState();
      }, { rootMargin: '120px 0px' });

      observer.observe(card);
    } else {
      isNearViewport = true;
      syncFlowState();
    }

    document.addEventListener('visibilitychange', syncFlowState);
  }

  setupArchitectureFlow();

  if (!window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const hasResultsHomepage = Boolean(document.querySelector('.hero-copy'));

  if (hasResultsHomepage) {
    gsap.from('.site-header', {
      y: -18,
      opacity: 0,
      duration: 0.55,
      ease: 'power3.out'
    });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-copy .status-pill', { y: 14, opacity: 0, duration: 0.38 })
      .from('.hero-copy .role-banner', { y: 12, opacity: 0, duration: 0.35 }, '-=0.18')
      .from('.hero-copy h1', { y: 28, opacity: 0, duration: 0.65 }, '-=0.14')
      .from('.hero-copy .hero-lead', { y: 18, opacity: 0, duration: 0.48 }, '-=0.3')
      .from('.hero-copy .hero-actions .button', {
        y: 14,
        opacity: 0,
        duration: 0.35,
        stagger: 0.06
      }, '-=0.22')
      .from('.hero-copy .hero-proof li', {
        y: 9,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05
      }, '-=0.16');

    // Keep the portrait visible throughout the entrance animation. Previous
    // versions used opacity here, which could leave the main image invisible.
    gsap.from('.hero-visual', {
      x: 34,
      scale: 0.98,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'transform'
    });

    gsap.from('.hero-visual .floating-result', {
      y: 13,
      opacity: 0,
      duration: 0.42,
      delay: 0.28,
      stagger: 0.08,
      ease: 'power3.out'
    });

    document.querySelectorAll('.reveal').forEach(function (element) {
      gsap.from(element, {
        y: 28,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: window.ScrollTrigger ? {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none none'
        } : null
      });
    });

    document.querySelectorAll('.metric-value').forEach(function (element) {
      gsap.from(element, {
        y: 14,
        scale: 0.96,
        opacity: 0,
        duration: 0.42,
        ease: 'back.out(1.5)',
        scrollTrigger: window.ScrollTrigger ? {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none none'
        } : null
      });
    });
  } else {
    const heroProfilePanel = document.querySelector('.hero .panel, .hero-panel');
    if (heroProfilePanel) {
      gsap.set(heroProfilePanel, { autoAlpha: 1, clearProps: 'opacity,visibility' });
    }

    gsap.from('.nav', { y: -24, opacity: 0, duration: 0.6, ease: 'power3.out' });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.eyebrow', { y: 18, opacity: 0, duration: 0.45 })
      .from('h1', { y: 34, opacity: 0, duration: 0.7 }, '-=0.18')
      .from('.lead', { y: 22, opacity: 0, duration: 0.55 }, '-=0.32')
      .from('.actions .btn', { y: 18, opacity: 0, duration: 0.42, stagger: 0.07 }, '-=0.25');

    if (heroProfilePanel) {
      gsap.fromTo(heroProfilePanel,
        { x: 34, opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.62,
          ease: 'power3.out',
          delay: 0.2,
          clearProps: 'opacity,visibility'
        }
      );
    }
  }

  document.querySelectorAll(
    '.card, .kpi, .exp, .experience-item, .logic-card, .score-box, .hud-box, .tool, .action-card, .table-card'
  ).forEach(function (element) {
    gsap.from(element, {
      y: 32,
      opacity: 0,
      duration: 0.55,
      ease: 'power3.out',
      scrollTrigger: window.ScrollTrigger ? {
        trigger: element,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      } : null
    });
  });

  document.querySelectorAll('.dashboard, .game').forEach(function (element, index) {
    gsap.to(element, {
      y: index % 2 ? -6 : -10,
      ease: 'none',
      scrollTrigger: window.ScrollTrigger ? {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      } : null
    });
  });

  document.querySelectorAll('.btn, .tab, .mission-tab, .tool, .action-card, .kpi').forEach(function (element) {
    element.addEventListener('mouseenter', function () {
      gsap.to(element, { y: -3, scale: 1.02, duration: 0.16 });
    });
    element.addEventListener('mouseleave', function () {
      gsap.to(element, { y: 0, scale: 1, duration: 0.16 });
    });
  });

  document.querySelectorAll('.photo-frame, .brand-dot, .dot, .pulse').forEach(function (element) {
    gsap.to(element, {
      y: -5,
      duration: 1.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });

  window.addEventListener('load', function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
});
