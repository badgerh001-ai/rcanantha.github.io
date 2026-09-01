// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Brand-logo reliability fallback: if a CDN logo image fails to load
// (network blip, ad-blocker, offline), replace it with the matching
// Font Awesome icon so the page never shows a broken-image box.
function iconFallback(img) {
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  const faClass = img.getAttribute('data-fallback-fa');
  if (!faClass) return;
  const icon = document.createElement('i');
  icon.className = faClass + ' brand-icon-fallback';
  img.replaceWith(icon);
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
}

function closeMobileMenu() {
  hamburger?.classList.remove('active');
  mobileMenu?.classList.remove('active');
}

// Hero word cycle
const words = ['Websites', 'Chatbots', 'Apps', 'Systems', 'Brands'];
const wordEl = document.getElementById('wordCycle');
let wordIndex = 0;

if (wordEl) {
  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    wordEl.style.opacity = 0;
    setTimeout(() => {
      wordEl.textContent = words[wordIndex];
      wordEl.style.opacity = 1;
    }, 250);
  }, 2200);
  wordEl.style.transition = 'opacity 0.25s ease';
}

// Scroll reveal for process steps
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => observer.observe(el));
}

// "Coming soon" toast
function showComingSoon(e) {
  e.preventDefault();
  const banner = document.getElementById('comingSoonBanner');
  if (!banner) return;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 2600);
}

// Hero particle network background
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];
  let width, height;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(31,216,255,${0.16 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(94,233,255,0.75)';
      ctx.fill();
    }
    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  } else {
    step();
  }
})();

// Hero cursor-follow glow
(function initCursorGlow() {
  const hero = document.getElementById('home');
  const glow = document.getElementById('heroCursorGlow');
  if (!hero || !glow) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`;
  });
})();

// Animated stat counters
(function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => observer.observe(el));
})();

// 3D tilt effect on service cards
(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// Service category tabs
(function initServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const cards = document.querySelectorAll('.service-card');
  if (!tabs.length || !cards.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
})();

// FAQ accordion
(function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();
