(function () {
  const canvas = document.getElementById('machineBackground');
  const context = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!context) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frameId = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let running = false;

  function getPalette() {
    const bright = document.documentElement.classList.contains('bright-mode');
    return bright ? {
      line: 'rgba(8, 121, 223, 0.24)',
      soft: 'rgba(0, 154, 196, 0.13)',
      glow: 'rgba(8, 121, 223, 0.16)'
    } : {
      line: 'rgba(73, 215, 255, 0.26)',
      soft: 'rgba(45, 140, 255, 0.14)',
      glow: 'rgba(73, 215, 255, 0.18)'
    };
  }

  function strokeArc(radius, start, end, color, lineWidth) {
    context.beginPath();
    context.arc(0, 0, radius, start, end);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  }

  function drawCircuit(radius, palette) {
    const paths = [
      [
        [-radius * 1.55, -radius * 0.28],
        [-radius * 0.95, -radius * 0.28],
        [-radius * 0.72, -radius * 0.5]
      ],
      [
        [-radius * 1.4, radius * 0.38],
        [-radius * 1.02, radius * 0.38],
        [-radius * 0.78, radius * 0.58]
      ]
    ];

    paths.forEach(function (points) {
      context.beginPath();
      points.forEach(function (point, index) {
        if (index === 0) context.moveTo(point[0], point[1]);
        else context.lineTo(point[0], point[1]);
      });
      context.strokeStyle = palette.soft;
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.arc(points[0][0], points[0][1], 3, 0, Math.PI * 2);
      context.fillStyle = palette.line;
      context.fill();
    });
  }

  function draw(time) {
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const palette = getPalette();
    const radius = Math.max(150, Math.min(330, Math.min(width, height) * 0.33));
    const centerX = width * 0.78 + current.x * 18;
    const centerY = height * 0.48 + current.y * 12;
    const rotation = time * 0.00004;

    context.save();
    context.translate(centerX, centerY);
    context.shadowColor = palette.glow;
    context.shadowBlur = 16;
    drawCircuit(radius, palette);

    [0.35, 0.52, 0.7, 0.88, 1].forEach(function (scale, index) {
      const direction = index % 2 ? -1 : 1;
      const offset = rotation * direction * (index + 1);
      const span = Math.PI * (1.15 + index * 0.08);
      strokeArc(
        radius * scale,
        offset,
        offset + span,
        index % 2 ? palette.soft : palette.line,
        index === 0 ? 1.5 : 1
      );
      strokeArc(
        radius * scale,
        offset + Math.PI * 1.35,
        offset + Math.PI * 1.72,
        palette.soft,
        1
      );
    });

    for (let index = 0; index < 8; index += 1) {
      const angle = index * Math.PI / 4 - rotation * 1.8;
      const nodeRadius = radius * (index % 2 ? 0.7 : 0.84);
      const x = Math.cos(angle) * nodeRadius;
      const y = Math.sin(angle) * nodeRadius;

      context.beginPath();
      context.moveTo(
        Math.cos(angle) * radius * 0.38,
        Math.sin(angle) * radius * 0.38
      );
      context.lineTo(x, y);
      context.strokeStyle = palette.soft;
      context.stroke();

      context.beginPath();
      context.arc(x, y, 2.5 + Math.sin(time * 0.0015 + index) * 0.7, 0, Math.PI * 2);
      context.fillStyle = palette.line;
      context.fill();
    }

    context.beginPath();
    context.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
    context.fillStyle = palette.glow;
    context.fill();
    context.restore();
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    draw(window.performance.now());
  }

  function onPointerMove(event) {
    target.x = event.clientX / width - 0.5;
    target.y = event.clientY / height - 0.5;
  }

  function tick(time) {
    if (!running) return;
    current.x += (target.x - current.x) * 0.045;
    current.y += (target.y - current.y) * 0.045;
    draw(time);
    frameId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    frameId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(frameId);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (!coarsePointer && !reduceMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (reduceMotion) draw(0);
    else start();
  });

  new MutationObserver(function () {
    if (reduceMotion) draw(0);
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  if (!reduceMotion) start();
}());
