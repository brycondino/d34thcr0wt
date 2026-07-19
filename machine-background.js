(function () {
  'use strict';

  const canvas = document.getElementById('machineBackground');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  const stars = Array.from({ length: innerWidth < 760 ? 22 : 40 }, function () {
    return { x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.5, s: 0.00001 + Math.random() * 0.000025, p: Math.random() * 6.28 };
  });
  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let active = false;

  function palette() {
    return root.classList.contains('bright-mode') ? {
      line: 'rgba(0,112,208,.32)', soft: 'rgba(8,121,223,.12)', faint: 'rgba(0,154,196,.07)', glow: 'rgba(8,121,223,.17)', dot: 'rgba(0,112,208,.48)'
    } : {
      line: 'rgba(73,215,255,.34)', soft: 'rgba(45,140,255,.16)', faint: 'rgba(73,215,255,.075)', glow: 'rgba(73,215,255,.22)', dot: 'rgba(106,226,255,.6)'
    };
  }

  function syncTheme() {
    const bright = root.classList.contains('bright-mode');
    canvas.style.opacity = bright ? '.24' : '.42';
    canvas.style.filter = bright ? 'saturate(.95) contrast(1.05)' : 'saturate(1.08)';
    canvas.style.mixBlendMode = bright ? 'multiply' : 'screen';
  }

  function resize() {
    w = innerWidth;
    h = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    draw(performance.now());
  }

  function node(x, y, r, color, glow) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (glow) {
      ctx.beginPath();
      ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  }

  function arc(r, start, span, color, width) {
    ctx.beginPath();
    ctx.arc(0, 0, r, start, start + span);
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 1;
    ctx.stroke();
  }

  function machine(x, y, r, time, alpha, reverse, p) {
    const rot = time * 0.000045 * (reverse ? -1 : 1);
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = p.glow;
    ctx.shadowBlur = 14;

    const scan = ctx.createRadialGradient(0, 0, r * .08, 0, 0, r * 1.08);
    scan.addColorStop(0, p.soft);
    scan.addColorStop(.55, p.faint);
    scan.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.rotate(rot * 2.3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r * 1.08, -.085, .085);
    ctx.closePath();
    ctx.fillStyle = scan;
    ctx.fill();
    ctx.restore();

    [.22, .36, .51, .67, .84, 1].forEach(function (scale, i) {
      const off = rot * (i % 2 ? -1 : 1) * (i + 1.4);
      arc(r * scale, off, Math.PI * (.9 + i * .085), i % 2 ? p.soft : p.line, i ? 1 : 1.6);
      arc(r * scale, off + Math.PI * 1.28, Math.PI * (.2 + i * .018), i % 2 ? p.faint : p.soft, 1);
    });

    for (let i = 0; i < 10; i += 1) {
      const a = i * Math.PI / 5 - rot * 1.65;
      const nr = r * (i % 2 ? .67 : .86);
      const ir = r * (i % 3 ? .38 : .27);
      const nx = Math.cos(a) * nr;
      const ny = Math.sin(a) * nr;
      const pulse = (Math.sin(time * .0015 + i * .8) + 1) / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * ir, Math.sin(a) * ir);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = i % 2 ? p.faint : p.soft;
      ctx.stroke();
      node(nx, ny, 1.5 + pulse * 1.4, p.dot, pulse > .68 ? p.glow : null);
    }

    [[-1.55, -.29, -.76, -.52], [-1.42, .4, -.74, .61], [1.48, -.2, .78, -.46]].forEach(function (v, i) {
      ctx.beginPath();
      ctx.moveTo(r * v[0], r * v[1]);
      ctx.lineTo(r * (v[0] + v[2]) / 2, r * v[1]);
      ctx.lineTo(r * v[2], r * v[3]);
      ctx.strokeStyle = i === 1 ? p.faint : p.soft;
      ctx.stroke();
      node(r * v[0], r * v[1], 2.2, p.dot, null);
    });

    node(0, 0, r * .11, p.glow, null);
    node(0, 0, r * .035, p.dot, p.glow);
    ctx.restore();
  }

  function draw(time) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const p = palette();

    stars.forEach(function (s, i) {
      const sy = ((s.y + time * s.s) % 1.1 - .05) * h;
      const sx = (s.x + Math.sin(time * .0003 + s.p) * .012) * w;
      ctx.globalAlpha = .3 + (Math.sin(time * .001 + s.p + i) + 1) * .24;
      node(sx, sy, s.r, p.dot, null);
    });
    ctx.globalAlpha = 1;

    for (let i = 0; i < (w < 760 ? 2 : 4); i += 1) {
      const ly = h * (.19 + i * .21) + pointer.y * (5 + i * 2);
      const end = w * (.42 + i * .08);
      ctx.beginPath();
      ctx.moveTo(-80 + i * 35, ly);
      ctx.lineTo(end, ly);
      ctx.lineTo(end + 34, ly - 34);
      ctx.strokeStyle = i % 2 ? p.faint : p.soft;
      ctx.stroke();
      const progress = (time * (.00005 + i * .000008) + i * .24) % 1;
      node((-80 + i * 35) + (end + 80 - i * 35) * progress, ly, 1.4, p.dot, p.glow);
    }

    const r = Math.max(165, Math.min(355, Math.min(w, h) * .35));
    machine(w * .13 - pointer.x * 15, h * .78 - pointer.y * 10, r * .48, time * .82, .42, true, p);
    machine(w * .79 + pointer.x * 34, h * .46 + pointer.y * 24, r, time, 1, false, p);
  }

  function tick(time) {
    if (!active) return;
    const ease = pointer.inside ? .055 : .025;
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    draw(time);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (active || reduced.matches) return;
    active = true;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    active = false;
    cancelAnimationFrame(raf);
  }

  function installCursor() {
    if (!fine.matches || reduced.matches || !document.body) return;

    const style = document.createElement('style');
    style.textContent = '@media(hover:hover) and (pointer:fine){html.sci-fi-cursor,html.sci-fi-cursor body,html.sci-fi-cursor a,html.sci-fi-cursor button,html.sci-fi-cursor summary,html.sci-fi-cursor [role="button"]{cursor:none!important}html.sci-fi-cursor input,html.sci-fi-cursor textarea{cursor:text!important}}';
    document.head.appendChild(style);

    const c = document.createElement('canvas');
    const x = c.getContext('2d');
    c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, { position: 'fixed', inset: '0', zIndex: '9999', pointerEvents: 'none', opacity: '0', transition: 'opacity .16s ease' });
    document.body.appendChild(c);

    const pos = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2 };
    const trail = Array.from({ length: 10 }, function () { return { on: false, x: 0, y: 0, life: 0, dx: 0, dy: 0 }; });
    let cw = 0;
    let ch = 0;
    let cdpr = 1;
    let cursorRaf = 0;
    let cursorOn = false;
    let visible = false;
    let hover = false;
    let pressed = false;
    let lastX = pos.x;
    let lastY = pos.y;
    let lastSpawn = 0;
    let next = 0;
    let angle = 0;

    function cursorResize() {
      cw = innerWidth;
      ch = innerHeight;
      cdpr = Math.min(devicePixelRatio || 1, 2);
      c.width = cw * cdpr;
      c.height = ch * cdpr;
      c.style.width = cw + 'px';
      c.style.height = ch + 'px';
    }

    function cursorColors() {
      return root.classList.contains('bright-mode') ? ['#0879df', '#005ca8', 'rgba(8,121,223,.25)'] : ['#67e3ff', '#e8fbff', 'rgba(73,215,255,.4)'];
    }

    function spawn(time) {
      if (Math.hypot(pos.x - lastX, pos.y - lastY) < 9 || time - lastSpawn < 18) return;
      const t = trail[next];
      Object.assign(t, { on: true, x: pos.x, y: pos.y, life: 1, dx: (Math.random() - .5) * .018, dy: -.012 - Math.random() * .018 });
      lastX = pos.x;
      lastY = pos.y;
      lastSpawn = time;
      next = (next + 1) % trail.length;
    }

    function cursorTick(time) {
      if (!cursorOn) return;
      pos.rx += (pos.x - pos.rx) * .2;
      pos.ry += (pos.y - pos.ry) * .2;
      angle += hover ? .07 : .025;
      x.setTransform(cdpr, 0, 0, cdpr, 0, 0);
      x.clearRect(0, 0, cw, ch);
      const colors = cursorColors();

      if (visible) spawn(time);
      trail.forEach(function (t) {
        if (!t.on) return;
        t.life -= .055;
        if (t.life <= 0) { t.on = false; return; }
        t.x += t.dx * 16;
        t.y += t.dy * 16;
        x.globalAlpha = t.life * .32;
        x.fillStyle = colors[0];
        x.shadowColor = colors[2];
        x.shadowBlur = 8;
        x.beginPath();
        x.arc(t.x, t.y, Math.max(.5, 2.2 * t.life), 0, Math.PI * 2);
        x.fill();
      });

      x.globalAlpha = visible ? 1 : 0;
      x.shadowColor = colors[2];
      x.shadowBlur = 18;
      const rr = pressed ? 13 : hover ? 22 : 17;
      x.strokeStyle = colors[0];
      x.lineWidth = 1;
      x.beginPath();
      x.arc(pos.rx, pos.ry, rr, angle, angle + Math.PI * 1.35);
      x.stroke();
      x.globalAlpha = visible ? .35 : 0;
      x.beginPath();
      x.arc(pos.rx, pos.ry, rr, angle + Math.PI * 1.55, angle + Math.PI * 1.85);
      x.stroke();
      x.globalAlpha = visible ? 1 : 0;
      x.fillStyle = colors[1];
      x.beginPath();
      x.arc(pos.x, pos.y, hover ? 3.5 : 2.5, 0, Math.PI * 2);
      x.fill();
      x.shadowBlur = 0;
      x.globalAlpha = 1;
      cursorRaf = requestAnimationFrame(cursorTick);
    }

    function cursorStart() {
      if (cursorOn || document.hidden) return;
      cursorOn = true;
      cursorRaf = requestAnimationFrame(cursorTick);
    }

    function cursorStop() {
      cursorOn = false;
      cancelAnimationFrame(cursorRaf);
    }

    cursorResize();
    addEventListener('resize', cursorResize, { passive: true });
    addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      pos.x = event.clientX;
      pos.y = event.clientY;
      visible = true;
      c.style.opacity = '1';
      root.classList.add('sci-fi-cursor');
      hover = event.target instanceof Element && Boolean(event.target.closest('a,button,summary,input,select,textarea,[role="button"],[tabindex]:not([tabindex="-1"]),.case-card,.service-card,.portrait-button'));
      cursorStart();
    }, { passive: true });
    addEventListener('pointerdown', function () { pressed = true; }, { passive: true });
    addEventListener('pointerup', function () { pressed = false; }, { passive: true });
    addEventListener('pointerout', function (event) {
      if (event.relatedTarget === null) {
        visible = false;
        hover = false;
        pressed = false;
        c.style.opacity = '0';
      }
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cursorStop();
      else if (visible) cursorStart();
    });
  }

  syncTheme();
  resize();
  addEventListener('resize', resize, { passive: true });
  if (!reduced.matches) {
    addEventListener('pointermove', function (event) {
      pointer.inside = true;
      pointer.tx = event.clientX / Math.max(w, 1) - .5;
      pointer.ty = event.clientY / Math.max(h, 1) - .5;
    }, { passive: true });
    root.addEventListener('mouseleave', function () {
      pointer.inside = false;
      pointer.tx = 0;
      pointer.ty = 0;
    }, { passive: true });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (!reduced.matches) start();
  });
  new MutationObserver(function () {
    syncTheme();
    if (!active) draw(performance.now());
  }).observe(root, { attributes: true, attributeFilter: ['class'] });
  installCursor();
  if (!reduced.matches) start();
}());