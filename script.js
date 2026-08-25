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
