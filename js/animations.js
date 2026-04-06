/* ═══════════════════════════════════════════════
   Hideaway Coffee House — 3D Mouse-Follow Animations
   Floating particles, 3D card tilt, custom cursor, parallax
   ═══════════════════════════════════════════════ */

'use strict';

(() => {

  // ── State ─────────────────────────────────────
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 }; // raw + smoothed
  let W, H, dpr, canvas, ctx, raf;
  const particles = [];
  const PARTICLE_COUNT = 45;

  // ── Warm palette matching the site ────────────
  const COLORS = [
    'rgba(201,168,130,0.35)',  // latte
    'rgba(139,94,60,0.25)',    // caramel
    'rgba(122,140,110,0.2)',   // sage
    'rgba(201,130,26,0.15)',   // gold
    'rgba(58,31,13,0.1)',      // roast
  ];

  // ═══════════════════════════════════════════════
  //  1. FLOATING 3D PARTICLE CANVAS (Hero)
  // ═══════════════════════════════════════════════

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : -20;
      this.z = Math.random() * 600 + 200; // depth 200–800
      this.radius = Math.random() * 3 + 1.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = Math.random() * 0.15 + 0.08;
      this.vz = (Math.random() - 0.5) * 0.5;
      this.shape = Math.random() > 0.6 ? 'diamond' : 'circle';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.baseX = this.x;
      this.baseY = this.y;
      this.oscillateAmp = Math.random() * 30 + 10;
      this.oscillateSpeed = Math.random() * 0.01 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
      this.t = 0;
    }

    update() {
      this.t++;
      this.rotation += this.rotationSpeed;

      // Depth perspective factor
      const perspective = 800 / (800 + this.z);

      // Mouse influence — deeper particles react less
      const influence = perspective * 0.06;
      const dx = (mouse.sx - W / 2) * influence;
      const dy = (mouse.sy - H / 2) * influence;

      // Gentle oscillation
      const osc = Math.sin(this.t * this.oscillateSpeed + this.phase) * this.oscillateAmp * perspective;

      this.baseX += this.vx;
      this.baseY += this.vy;
      this.z += this.vz;

      this.x = this.baseX + dx + osc;
      this.y = this.baseY + dy;

      // Wrap around
      if (this.baseY > H + 30) this.reset(false);
      if (this.baseX < -50) this.baseX = W + 50;
      if (this.baseX > W + 50) this.baseX = -50;
      if (this.z < 100) this.z = 800;
      if (this.z > 900) this.z = 200;

      return perspective;
    }

    draw(perspective) {
      const r = this.radius * perspective * dpr;
      if (r < 0.3) return;

      ctx.save();
      ctx.translate(this.x * dpr, this.y * dpr);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = perspective * 0.8;

      if (this.shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.4);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r * 1.4);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function initCanvas() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    animate();
  }

  function resize() {
    const hero = document.getElementById('hero');
    if (!hero || !canvas) return;
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
  }

  function drawConnections(perspArr) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12 * Math.min(perspArr[i], perspArr[j]);
          ctx.beginPath();
          ctx.moveTo(a.x * dpr, a.y * dpr);
          ctx.lineTo(b.x * dpr, b.y * dpr);
          ctx.strokeStyle = `rgba(201,168,130,${alpha})`;
          ctx.lineWidth = 0.5 * dpr;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const perspArr = [];
    for (let i = 0; i < particles.length; i++) {
      perspArr.push(particles[i].update());
    }

    drawConnections(perspArr);

    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(perspArr[i]);
    }

    raf = requestAnimationFrame(animate);
  }


  // ═══════════════════════════════════════════════
  //  2. CUSTOM CURSOR (dot + ring)
  // ═══════════════════════════════════════════════

  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // no touch

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let ringX = 0, ringY = 0;

    function moveCursor() {
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;

      // Smooth follow for ring
      ringX += (mouse.x - ringX) * 0.15;
      ringY += (mouse.y - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      requestAnimationFrame(moveCursor);
    }
    moveCursor();

    // Scale ring on interactive elements
    const interactives = 'a, button, .menu-card, .review-card, .about-card, input, textarea, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      }
    });
  }


  // ═══════════════════════════════════════════════
  //  3. 3D CARD TILT
  // ═══════════════════════════════════════════════

  function initCardTilt() {
    const cards = document.querySelectorAll('.menu-card, .review-card, .about-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const rotateX = ((y - cy) / cy) * -8;  // max 8 degrees
        const rotateY = ((x - cx) / cx) * 8;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale3d(1,1,1)';
      });
    });
  }


  // ═══════════════════════════════════════════════
  //  4. HERO PARALLAX (blobs + content depth)
  // ═══════════════════════════════════════════════

  function initHeroParallax() {
    const blobs = document.querySelectorAll('.hero-blob');
    const heroContent = document.querySelector('.hero-content');
    if (!blobs.length && !heroContent) return;

    const depths = [0.04, 0.025, 0.015];

    function updateParallax() {
      const cx = mouse.sx - W / 2;
      const cy = mouse.sy - H / 2;

      blobs.forEach((blob, i) => {
        const d = depths[i] || 0.02;
        const tx = cx * d;
        const ty = cy * d;
        blob.style.transform = `translate(${tx}px, ${ty}px) scale(1.05)`;
      });

      if (heroContent) {
        heroContent.style.transform = `translate(${cx * -0.008}px, ${cy * -0.008}px)`;
      }

      requestAnimationFrame(updateParallax);
    }
    updateParallax();
  }


  // ═══════════════════════════════════════════════
  //  5. MAGNETIC BUTTONS
  // ═══════════════════════════════════════════════

  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }


  // ═══════════════════════════════════════════════
  //  6. SMOOTH TEXT SPLIT REVEAL (Hero title)
  // ═══════════════════════════════════════════════

  function initTextReveal() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    // Wrap each word in a span
    const html = title.innerHTML;
    const wrapped = html.replace(/(<[^>]+>)|(\S+)/g, (match, tag, word) => {
      if (tag) return tag; // keep HTML tags as-is
      return `<span class="word-reveal"><span class="word-inner">${word}</span></span>`;
    });
    title.innerHTML = wrapped;

    // Animate after a short delay
    const words = title.querySelectorAll('.word-inner');
    words.forEach((word, i) => {
      setTimeout(() => {
        word.classList.add('word-visible');
      }, 300 + i * 80);
    });
  }


  // ═══════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════

  // Global mouse tracking with smoothing
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Smooth interpolation loop
  function smoothMouse() {
    mouse.sx += (mouse.x - mouse.sx) * 0.08;
    mouse.sy += (mouse.y - mouse.sy) * 0.08;
    requestAnimationFrame(smoothMouse);
  }
  smoothMouse();

  window.addEventListener('resize', () => {
    resize();
  });

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) return; // respect accessibility

    initCanvas();
    initCursor();
    initCardTilt();
    initHeroParallax();
    initMagneticButtons();
    initTextReveal();
  });

})();
