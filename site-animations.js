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

  function setupCaseStudyVisuals() {
    const cards = Array.from(document.querySelectorAll('#case-studies .case-card'));
    if (!cards.length) return;

    const style = document.createElement('style');
    style.textContent = `
      .case-visual{isolation:isolate}
      .case-visual::before{position:absolute;inset:0;content:"";pointer-events:none;background-image:linear-gradient(rgba(73,215,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(73,215,255,.055) 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.9),transparent)}
      .case-preview{position:relative;z-index:2;min-height:190px;display:flex;flex-direction:column;gap:10px;padding:12px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(160deg,rgba(8,16,29,.82),rgba(13,25,42,.64));box-shadow:inset 0 1px rgba(255,255,255,.04),0 18px 42px rgba(0,0,0,.18);backdrop-filter:blur(14px);overflow:hidden}
      html.bright-mode .case-preview{background:linear-gradient(160deg,rgba(255,255,255,.94),rgba(225,238,251,.82))}
      .case-preview::after{position:absolute;inset:-45% 0 auto;height:42%;content:"";background:linear-gradient(180deg,transparent,rgba(73,215,255,.14),transparent);animation:case-scan 5.4s linear infinite;pointer-events:none}
      .preview-top,.preview-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .preview-title,.preview-live,.preview-label,.preview-value,.preview-small{font-family:"Space Grotesk",sans-serif}
      .preview-title{font-size:.61rem;font-weight:800;letter-spacing:.11em;text-transform:uppercase}
      .preview-live{display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border:1px solid rgba(73,215,255,.24);border-radius:999px;color:var(--cyan);font-size:.48rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
      .preview-live::before{width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 9px var(--green);content:""}
      .preview-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
      .preview-kpi,.preview-panel,.flow-node,.test-cell{border:1px solid var(--line);background:rgba(255,255,255,.035)}
      .preview-kpi{padding:7px;border-radius:9px}
      .preview-label{display:block;color:var(--muted);font-size:.43rem;letter-spacing:.07em;text-transform:uppercase}
      .preview-value{display:block;margin-top:3px;color:var(--text);font-size:.74rem;font-weight:800}
      .preview-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:7px;flex:1}
      .preview-panel{position:relative;min-height:82px;padding:8px;border-radius:11px;overflow:hidden}
      .preview-bars{height:62px;display:flex;align-items:flex-end;gap:5px}
      .preview-bars i{display:block;flex:1;height:var(--h);border-radius:4px 4px 2px 2px;background:linear-gradient(to top,var(--primary-strong),var(--cyan));animation:case-bar 3s ease-in-out infinite alternate}
      .preview-line{position:absolute;inset:18px 8px 8px}
      .preview-line svg{width:100%;height:100%;overflow:visible}
      .preview-line path{fill:none;stroke:var(--cyan);stroke-width:2;filter:drop-shadow(0 0 5px rgba(73,215,255,.55));stroke-dasharray:160;animation:case-draw 4.8s ease-in-out infinite}
      .preview-status{display:grid;gap:5px}
      .preview-status span{display:flex;align-items:center;justify-content:space-between;padding:5px 6px;border-bottom:1px solid var(--line);color:var(--muted);font-size:.48rem}
      .preview-status b{color:var(--green);font-size:.48rem}
      .perf-track{position:relative;height:70px;margin-top:5px}
      .perf-track::before,.perf-track::after{position:absolute;right:0;left:0;height:2px;border-radius:99px;content:""}
      .perf-track::before{top:20px;background:linear-gradient(90deg,#ff7b7b 0 78%,rgba(255,255,255,.08) 78%)}
      .perf-track::after{top:48px;background:linear-gradient(90deg,var(--green) 0 38%,rgba(255,255,255,.08) 38%)}
      .perf-track i{position:absolute;width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 10px var(--cyan);animation:case-pulse 2.2s ease-in-out infinite}
      .perf-track i:first-child{top:17px;left:76%}.perf-track i:last-child{top:45px;left:36%}
      .flow{position:relative;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;gap:7px;min-height:94px}
      .flow::before{position:absolute;right:10%;left:10%;top:50%;height:1px;background:var(--architecture-line);content:""}
      .flow-node{position:relative;z-index:1;display:grid;min-height:49px;place-items:center;padding:5px;border-radius:10px;color:var(--text);font-size:.46rem;font-weight:800;text-align:center}
      .flow-node::after{position:absolute;width:6px;height:6px;right:-7px;top:50%;border-radius:50%;background:var(--cyan);box-shadow:0 0 10px var(--cyan);content:"";animation:case-flow 3.6s linear infinite}
      .flow-node:last-child::after{display:none}
      .ai-stack{display:grid;gap:6px}
      .ai-step{display:grid;grid-template-columns:24px 1fr auto;align-items:center;gap:7px;padding:7px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.035)}
      .ai-step strong{display:grid;width:22px;height:22px;place-items:center;border-radius:7px;background:var(--blue-wash);color:var(--primary);font-size:.5rem}
      .ai-step span{font-size:.52rem;font-weight:700}.ai-step em{color:var(--green);font-size:.44rem;font-style:normal}
      .test-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
      .test-cell{height:26px;display:grid;place-items:center;border-radius:7px;color:var(--green);font-size:.58rem;animation:case-test 3s ease-in-out infinite}
      .test-cell:nth-child(4n){color:var(--cyan)}
      .coverage{height:7px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}
      .coverage i{display:block;width:88%;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--primary),var(--green));animation:case-coverage 3.4s ease-in-out infinite alternate}
      @keyframes case-scan{to{transform:translateY(450%)}}
      @keyframes case-bar{to{filter:brightness(1.35);transform:scaleY(.92)}}
      @keyframes case-draw{0%,100%{stroke-dashoffset:160}50%{stroke-dashoffset:0}}
      @keyframes case-pulse{50%{transform:scale(1.7);opacity:.5}}
      @keyframes case-flow{from{transform:translateX(-5px)}to{transform:translateX(13px)}}
      @keyframes case-test{50%{border-color:rgba(86,230,165,.45);box-shadow:0 0 12px rgba(86,230,165,.12)}}
      @keyframes case-coverage{to{width:96%}}
      @media(max-width:680px){.case-preview{min-height:165px}.preview-grid{grid-template-columns:1fr}.preview-status{display:none}}
      @media(prefers-reduced-motion:reduce){.case-preview::after,.preview-bars i,.preview-line path,.perf-track i,.flow-node::after,.test-cell,.coverage i{animation:none!important}}
    `;
    document.head.appendChild(style);

    const previews = [
      `<div class="case-preview case-preview-reporting" aria-hidden="true"><div class="preview-top"><span class="preview-title">Operations intelligence</span><span class="preview-live">Live reporting</span></div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Spend</span><span class="preview-value">$1.28M</span></span><span class="preview-kpi"><span class="preview-label">Exceptions</span><span class="preview-value">18</span></span><span class="preview-kpi"><span class="preview-label">On time</span><span class="preview-value">97.4%</span></span></div><div class="preview-grid"><div class="preview-panel"><span class="preview-label">Weekly trend</span><span class="preview-line"><svg viewBox="0 0 160 55" preserveAspectRatio="none"><path d="M2 46 C24 42 30 18 48 30 S76 45 92 20 S122 8 158 15"/></svg></span></div><div class="preview-panel"><span class="preview-label">Volume</span><span class="preview-bars"><i style="--h:48%"></i><i style="--h:76%"></i><i style="--h:58%"></i><i style="--h:90%"></i></span></div></div><div class="preview-status"><span>Late invoice risk <b>LOW</b></span><span>Data refresh <b>COMPLETE</b></span></div></div>`,
      `<div class="case-preview case-preview-performance" aria-hidden="true"><div class="preview-top"><span class="preview-title">Query performance</span><span class="preview-live">Optimized</span></div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Before</span><span class="preview-value">8.4s</span></span><span class="preview-kpi"><span class="preview-label">After</span><span class="preview-value">3.1s</span></span><span class="preview-kpi"><span class="preview-label">Gain</span><span class="preview-value">63%</span></span></div><div class="preview-panel"><span class="preview-label">Execution timeline</span><div class="perf-track"><i></i><i></i></div></div><div class="preview-row"><span class="preview-small">INDEX · PLAN · STATS</span><span class="preview-live">Stable</span></div></div>`,
      `<div class="case-preview case-preview-automation" aria-hidden="true"><div class="preview-top"><span class="preview-title">Serverless pipeline</span><span class="preview-live">Running</span></div><div class="flow"><span class="flow-node">EVENT<br>TRIGGER</span><span class="flow-node">LAMBDA<br>PROCESS</span><span class="flow-node">RDS / S3<br>STORE</span><span class="flow-node">OUTPUT<br>READY</span></div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Processed</span><span class="preview-value">12.4k</span></span><span class="preview-kpi"><span class="preview-label">Failures</span><span class="preview-value">0.2%</span></span><span class="preview-kpi"><span class="preview-label">Manual</span><span class="preview-value">-70%</span></span></div></div>`,
      `<div class="case-preview case-preview-ai" aria-hidden="true"><div class="preview-top"><span class="preview-title">Grounded AI workflow</span><span class="preview-live">Human reviewed</span></div><div class="ai-stack"><div class="ai-step"><strong>01</strong><span>Business prompt</span><em>READY</em></div><div class="ai-step"><strong>02</strong><span>Context retrieval</span><em>VALID</em></div><div class="ai-step"><strong>03</strong><span>Analysis &amp; recommendation</span><em>92%</em></div><div class="ai-step"><strong>04</strong><span>Reviewable action plan</span><em>TRACE</em></div></div></div>`,
      `<div class="case-preview case-preview-qa" aria-hidden="true"><div class="preview-top"><span class="preview-title">Release validation</span><span class="preview-live">Suite active</span></div><div class="preview-row"><span class="preview-label">Regression coverage</span><span class="preview-value">88%</span></div><div class="coverage"><i></i></div><div class="test-grid">${Array.from({ length: 15 }, function (_, index) { return `<span class="test-cell">${index % 4 === 3 ? '●' : '✓'}</span>`; }).join('')}</div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Passed</span><span class="preview-value">142</span></span><span class="preview-kpi"><span class="preview-label">Review</span><span class="preview-value">3</span></span><span class="preview-kpi"><span class="preview-label">Blocked</span><span class="preview-value">0</span></span></div></div>`
    ];

    cards.forEach(function (card, index) {
      const art = card.querySelector('.case-art');
      if (!art || !previews[index]) return;
      art.outerHTML = previews[index];
      card.classList.add('case-card-enhanced');
    });
  }

  setupArchitectureFlow();
  setupCaseStudyVisuals();

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
