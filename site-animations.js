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
        isNearViewport = entries.some(function (entry) { return entry.isIntersecting; });
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
      .case-preview{position:relative;z-index:2;min-height:190px;display:flex;flex-direction:column;gap:10px;padding:12px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(160deg,rgba(8,16,29,.82),rgba(13,25,42,.64));overflow:hidden}
      html.bright-mode .case-preview{background:linear-gradient(160deg,rgba(255,255,255,.94),rgba(225,238,251,.82))}
      .case-preview::after{position:absolute;inset:-45% 0 auto;height:42%;content:"";background:linear-gradient(180deg,transparent,rgba(73,215,255,.14),transparent);animation:case-scan 5.4s linear infinite;pointer-events:none}
      .preview-top,.preview-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.preview-title,.preview-live,.preview-label,.preview-value{font-family:"Space Grotesk",sans-serif}.preview-title{font-size:.61rem;font-weight:800;letter-spacing:.11em;text-transform:uppercase}.preview-live{padding:4px 7px;border:1px solid rgba(73,215,255,.24);border-radius:999px;color:var(--cyan);font-size:.48rem;font-weight:800;text-transform:uppercase}.preview-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.preview-kpi,.preview-panel,.flow-node,.test-cell,.ai-step{border:1px solid var(--line);background:rgba(255,255,255,.035)}.preview-kpi{padding:7px;border-radius:9px}.preview-label{display:block;color:var(--muted);font-size:.43rem;text-transform:uppercase}.preview-value{display:block;margin-top:3px;color:var(--text);font-size:.74rem;font-weight:800}.preview-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:7px;flex:1}.preview-panel{position:relative;min-height:82px;padding:8px;border-radius:11px;overflow:hidden}.preview-bars{height:62px;display:flex;align-items:flex-end;gap:5px}.preview-bars i{display:block;flex:1;height:var(--h);border-radius:4px;background:linear-gradient(to top,var(--primary-strong),var(--cyan));animation:case-bar 3s ease-in-out infinite alternate}.preview-line{position:absolute;inset:18px 8px 8px}.preview-line svg{width:100%;height:100%}.preview-line path{fill:none;stroke:var(--cyan);stroke-width:2;stroke-dasharray:160;animation:case-draw 4.8s ease-in-out infinite}.preview-status{display:grid;gap:5px}.preview-status span{display:flex;justify-content:space-between;padding:5px 6px;border-bottom:1px solid var(--line);color:var(--muted);font-size:.48rem}.preview-status b{color:var(--green)}.perf-track{position:relative;height:70px}.perf-track::before,.perf-track::after{position:absolute;left:0;right:0;height:2px;content:""}.perf-track::before{top:20px;background:linear-gradient(90deg,#ff7b7b 0 78%,rgba(255,255,255,.08) 78%)}.perf-track::after{top:48px;background:linear-gradient(90deg,var(--green) 0 38%,rgba(255,255,255,.08) 38%)}.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;min-height:94px;align-items:center}.flow-node{display:grid;min-height:49px;place-items:center;padding:5px;border-radius:10px;font-size:.46rem;font-weight:800;text-align:center}.ai-stack{display:grid;gap:6px}.ai-step{display:grid;grid-template-columns:24px 1fr auto;align-items:center;gap:7px;padding:7px;border-radius:9px}.ai-step strong{display:grid;width:22px;height:22px;place-items:center;border-radius:7px;background:var(--blue-wash);color:var(--primary);font-size:.5rem}.ai-step span{font-size:.52rem}.ai-step em{color:var(--green);font-size:.44rem;font-style:normal}.test-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.test-cell{height:26px;display:grid;place-items:center;border-radius:7px;color:var(--green)}.coverage{height:7px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}.coverage i{display:block;width:88%;height:100%;background:linear-gradient(90deg,var(--primary),var(--green));animation:case-coverage 3.4s ease-in-out infinite alternate}@keyframes case-scan{to{transform:translateY(450%)}}@keyframes case-bar{to{transform:scaleY(.92)}}@keyframes case-draw{0%,100%{stroke-dashoffset:160}50%{stroke-dashoffset:0}}@keyframes case-coverage{to{width:96%}}@media(max-width:680px){.case-preview{min-height:165px}.preview-grid{grid-template-columns:1fr}.preview-status{display:none}}@media(prefers-reduced-motion:reduce){.case-preview::after,.preview-bars i,.preview-line path,.coverage i{animation:none!important}}
    `;
    document.head.appendChild(style);
    const previews = [
      `<div class="case-preview case-preview-reporting" aria-hidden="true"><div class="preview-top"><span class="preview-title">Operations intelligence</span><span class="preview-live">Live reporting</span></div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Spend</span><span class="preview-value">$1.28M</span></span><span class="preview-kpi"><span class="preview-label">Exceptions</span><span class="preview-value">18</span></span><span class="preview-kpi"><span class="preview-label">On time</span><span class="preview-value">97.4%</span></span></div><div class="preview-grid"><div class="preview-panel"><span class="preview-label">Weekly trend</span><span class="preview-line"><svg viewBox="0 0 160 55"><path d="M2 46 C24 42 30 18 48 30 S76 45 92 20 S122 8 158 15"/></svg></span></div><div class="preview-panel"><span class="preview-label">Volume</span><span class="preview-bars"><i style="--h:48%"></i><i style="--h:76%"></i><i style="--h:58%"></i><i style="--h:90%"></i></span></div></div><div class="preview-status"><span>Late invoice risk <b>LOW</b></span><span>Data refresh <b>COMPLETE</b></span></div></div>`,
      `<div class="case-preview case-preview-performance" aria-hidden="true"><div class="preview-top"><span class="preview-title">Query performance</span><span class="preview-live">Optimized</span></div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Before</span><span class="preview-value">8.4s</span></span><span class="preview-kpi"><span class="preview-label">After</span><span class="preview-value">3.1s</span></span><span class="preview-kpi"><span class="preview-label">Gain</span><span class="preview-value">63%</span></span></div><div class="preview-panel"><span class="preview-label">Execution timeline</span><div class="perf-track"></div></div></div>`,
      `<div class="case-preview case-preview-automation" aria-hidden="true"><div class="preview-top"><span class="preview-title">Serverless pipeline</span><span class="preview-live">Running</span></div><div class="flow"><span class="flow-node">EVENT<br>TRIGGER</span><span class="flow-node">LAMBDA<br>PROCESS</span><span class="flow-node">RDS / S3<br>STORE</span><span class="flow-node">OUTPUT<br>READY</span></div><div class="preview-kpis"><span class="preview-kpi"><span class="preview-label">Processed</span><span class="preview-value">12.4k</span></span><span class="preview-kpi"><span class="preview-label">Failures</span><span class="preview-value">0.2%</span></span><span class="preview-kpi"><span class="preview-label">Manual</span><span class="preview-value">-70%</span></span></div></div>`,
      `<div class="case-preview case-preview-ai" aria-hidden="true"><div class="preview-top"><span class="preview-title">Grounded AI workflow</span><span class="preview-live">Human reviewed</span></div><div class="ai-stack"><div class="ai-step"><strong>01</strong><span>Business prompt</span><em>READY</em></div><div class="ai-step"><strong>02</strong><span>Context retrieval</span><em>VALID</em></div><div class="ai-step"><strong>03</strong><span>Analysis & recommendation</span><em>92%</em></div><div class="ai-step"><strong>04</strong><span>Reviewable action plan</span><em>TRACE</em></div></div></div>`,
      `<div class="case-preview case-preview-qa" aria-hidden="true"><div class="preview-top"><span class="preview-title">Release validation</span><span class="preview-live">Suite active</span></div><div class="preview-row"><span class="preview-label">Regression coverage</span><span class="preview-value">88%</span></div><div class="coverage"><i></i></div><div class="test-grid">${Array.from({ length: 15 }, function (_, index) { return `<span class="test-cell">${index % 4 === 3 ? '●' : '✓'}</span>`; }).join('')}</div></div>`
    ];
    cards.forEach(function (card, index) {
      const art = card.querySelector('.case-art');
      if (art && previews[index]) art.outerHTML = previews[index];
    });
  }

  function setupHeroVisualFixes() {
    if (!document.querySelector('#hero .hero-grid')) return;
    const style = document.createElement('style');
    style.textContent = `@media(hover:hover) and (pointer:fine){html.sci-fi-cursor,html.sci-fi-cursor body,html.sci-fi-cursor a,html.sci-fi-cursor button{cursor:auto!important}body>canvas[style*="z-index: 9999"]{display:none!important}}@media(min-width:901px){#hero .hero-grid{grid-template-columns:minmax(0,.88fr) minmax(500px,1.12fr);gap:clamp(24px,4vw,54px)}#hero .hero-visual{width:min(100%,560px);min-height:430px;display:grid;place-items:center}#hero .portrait-button{width:min(380px,70%)}#hero .floating-result{left:0;right:auto;min-width:150px;max-width:182px}#hero .result-one{top:12%}#hero .result-two{top:40%}#hero .result-three{top:68%;bottom:auto}}@media(max-width:680px){#hero .hero-visual{min-height:360px;overflow:visible}#hero .portrait-button{width:min(250px,70%)}#hero .floating-result{min-width:104px;max-width:132px}#hero .result-one{top:8%;left:0}#hero .result-two{top:36%;right:0;left:auto}#hero .result-three{top:64%;bottom:auto;left:0}}`;
    document.head.appendChild(style);
    document.documentElement.classList.remove('sci-fi-cursor');
  }

  function setupTechnologyMarquee() {
    const strip = document.querySelector('.technology-strip');
    const list = strip && strip.querySelector('.technology-list');
    if (!strip || !list) return;

    const laneOne = [
      ['Oracle', 'OR', 'oracle'], ['MySQL', 'MY', 'mysql'], ['PostgreSQL', 'PG', 'postgresql'],
      ['SQL', 'SQL'], ['PL/SQL', 'PL'], ['TOAD for Oracle', 'TOAD'], ['SQL Developer', 'DEV'],
      ['MySQL Workbench', 'MW'], ['pgAdmin', 'PGA'], ['ETL', 'ETL'], ['Data Modelling', 'DM'],
      ['Data Lineage', 'DL'], ['Python', 'PY', 'python'], ['Unix Shell', 'SH'], ['Perl', 'PE']
    ];
    const laneTwo = [
      ['AWS', 'AWS', 'aws'], ['Lambda', 'λ', 'aws'], ['RDS', 'RDS', 'aws'], ['S3', 'S3', 'aws'],
      ['EC2', 'EC2', 'aws'], ['API Gateway', 'API', 'aws'], ['EventBridge', 'EB', 'aws'],
      ['CloudWatch', 'CW', 'aws'], ['Secrets Manager', 'SM', 'aws'], ['API Integration', 'API'],
      ['Workflow Automation', 'WA'], ['Git', 'GIT', 'git'], ['JIRA', 'JR'], ['Postman', 'PM', 'postman'],
      ['WinSCP', 'WS'], ['Cypress', 'CY', 'cypress'], ['CircleCI', 'CI'], ['Oracle APEX', 'AX', 'apex'],
      ['Confluence', 'CF'], ['UNIX', 'UX'], ['Linux', 'LX'], ['Windows', 'WIN'], ['Agile', 'AG'],
      ['Scrum', 'SC'], ['SDLC', 'SDLC']
    ];

    function renderItems(tools) {
      return tools.map(function (tool) {
        const brandClass = tool[2] ? ` technology-marquee-icon--${tool[2]}` : '';
        return `<span class="technology-marquee-item"><span class="technology-marquee-icon${brandClass}" aria-hidden="true">${tool[1]}</span><span class="technology-marquee-name">${tool[0]}</span></span>`;
      }).join('');
    }

    function renderLane(tools, directionClass) {
      const items = renderItems(tools);
      return `<div class="technology-marquee-lane ${directionClass}" tabindex="0"><div class="technology-marquee-track"><div class="technology-marquee-group">${items}</div><div class="technology-marquee-group" aria-hidden="true">${items}</div></div></div>`;
    }

    const marquee = document.createElement('div');
    marquee.className = 'technology-marquee';
    marquee.setAttribute('aria-label', 'Technical tools and platforms');
    marquee.innerHTML = renderLane(laneOne, 'technology-marquee-lane--forward') + renderLane(laneTwo, 'technology-marquee-lane--reverse');
    list.replaceWith(marquee);

    const style = document.createElement('style');
    style.textContent = `
      .technology-strip{overflow:hidden;padding:34px 0 32px}
      .technology-strip .container{width:100%;max-width:none}
      .technology-label{margin-bottom:22px}
      .technology-marquee{display:grid;gap:14px;overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
      .technology-marquee-lane{overflow:hidden;outline:none}
      .technology-marquee-track{display:flex;width:max-content;will-change:transform}
      .technology-marquee-lane--forward .technology-marquee-track{animation:technology-marquee-forward 44s linear infinite}
      .technology-marquee-lane--reverse .technology-marquee-track{animation:technology-marquee-reverse 48s linear infinite}
      .technology-marquee-group{display:flex;align-items:center;gap:16px;padding-right:16px}
      .technology-marquee-item{display:inline-flex;min-width:max-content;align-items:center;gap:10px;padding:8px 14px 8px 8px;border:1px solid var(--line);border-radius:999px;background:linear-gradient(135deg,var(--surface-strong),var(--surface));color:var(--muted);font-family:"Space Grotesk",sans-serif;font-size:.76rem;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.12);backdrop-filter:blur(12px)}
      .technology-marquee-icon{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgba(73,215,255,.28);border-radius:50%;background:var(--blue-wash);color:var(--cyan);font-size:.48rem;font-weight:800;letter-spacing:-.03em;box-shadow:inset 0 0 14px rgba(73,215,255,.05)}
      .technology-marquee-icon--oracle{border-color:rgba(255,72,72,.45);color:#ff6464}.technology-marquee-icon--aws{border-color:rgba(255,169,38,.48);color:#ffb23d}.technology-marquee-icon--python{border-color:rgba(255,215,80,.48);color:#ffd34e}.technology-marquee-icon--git{border-color:rgba(240,80,50,.48);color:#f66a4a}.technology-marquee-icon--postgresql{border-color:rgba(83,154,219,.5);color:#66a9e8}.technology-marquee-icon--mysql{border-color:rgba(0,156,190,.5);color:#32c2dc}.technology-marquee-icon--postman{border-color:rgba(255,108,55,.5);color:#ff7d4d}.technology-marquee-icon--cypress{border-color:rgba(86,230,165,.45);color:var(--green)}.technology-marquee-icon--apex{border-color:rgba(45,140,255,.48);color:var(--primary)}
      .technology-marquee-lane:hover .technology-marquee-track,.technology-marquee-lane:focus-within .technology-marquee-track{animation-play-state:paused}
      @keyframes technology-marquee-forward{to{transform:translateX(-50%)}}
      @keyframes technology-marquee-reverse{from{transform:translateX(-50%)}to{transform:translateX(0)}}
      @media(max-width:900px){.technology-marquee{gap:12px}.technology-marquee-group{gap:12px;padding-right:12px}.technology-marquee-item{font-size:.7rem}.technology-marquee-icon{width:31px;height:31px}}
      @media(max-width:680px){.technology-strip{padding-block:29px}.technology-marquee{mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}.technology-marquee-lane--forward .technology-marquee-track{animation-duration:50s}.technology-marquee-lane--reverse .technology-marquee-track{animation-duration:54s}}
      @media(prefers-reduced-motion:reduce){.technology-marquee{overflow:visible;mask-image:none;-webkit-mask-image:none}.technology-marquee-lane{overflow:visible}.technology-marquee-track{width:auto!important;animation:none!important}.technology-marquee-group{flex-wrap:wrap;justify-content:center}.technology-marquee-group[aria-hidden="true"]{display:none}.technology-marquee-item{white-space:normal}}
    `;
    document.head.appendChild(style);
  }

  setupArchitectureFlow();
  setupCaseStudyVisuals();
  setupHeroVisualFixes();
  setupTechnologyMarquee();

  if (!window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const hasResultsHomepage = Boolean(document.querySelector('.hero-copy'));
  if (hasResultsHomepage) {
    gsap.from('.site-header', { y: -18, opacity: 0, duration: 0.55, ease: 'power3.out' });
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-copy .status-pill', { y: 14, opacity: 0, duration: 0.38 })
      .from('.hero-copy .role-banner', { y: 12, opacity: 0, duration: 0.35 }, '-=0.18')
      .from('.hero-copy h1', { y: 28, opacity: 0, duration: 0.65 }, '-=0.14')
      .from('.hero-copy .hero-lead', { y: 18, opacity: 0, duration: 0.48 }, '-=0.3')
      .from('.hero-copy .hero-actions .button', { y: 14, opacity: 0, duration: 0.35, stagger: 0.06 }, '-=0.22')
      .from('.hero-copy .hero-proof li', { y: 9, opacity: 0, duration: 0.3, stagger: 0.05 }, '-=0.16');
    gsap.from('.hero-visual', { x: 34, scale: 0.98, duration: 0.7, ease: 'power3.out', clearProps: 'transform' });
    gsap.from('.hero-visual .floating-result', { y: 13, opacity: 0, duration: 0.42, delay: 0.28, stagger: 0.08, ease: 'power3.out' });
    document.querySelectorAll('.reveal').forEach(function (element) {
      gsap.from(element, { y: 28, opacity: 0, duration: 0.55, ease: 'power3.out', scrollTrigger: window.ScrollTrigger ? { trigger: element, start: 'top 88%', toggleActions: 'play none none none' } : null });
    });
    document.querySelectorAll('.metric-value').forEach(function (element) {
      gsap.from(element, { y: 14, scale: 0.96, opacity: 0, duration: 0.42, ease: 'back.out(1.5)', scrollTrigger: window.ScrollTrigger ? { trigger: element, start: 'top 90%', toggleActions: 'play none none none' } : null });
    });
  }
  window.addEventListener('load', function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
});
