/* ================================================================
   SREENANDHU JACY — PORTFOLIO JS
   Features:
   - Mobile nav toggle with full-screen overlay
   - Sticky header scroll effect
   - Scroll-spy navigation highlight
   - IntersectionObserver reveal animations
   - Cursor glow follow effect
   - Back-to-top button
   - Footer year auto-update
   ================================================================ */

'use strict';

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');
const themeLabel = themeToggle?.querySelector('span');
const storedTheme = localStorage.getItem('portfolio-theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);

  if (!themeToggle || !themeIcon || !themeLabel) return;

  const isLight = theme === 'light';
  themeIcon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  themeLabel.textContent = isLight ? 'Dark' : 'Light';
  themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
}

applyTheme(storedTheme || (systemPrefersLight ? 'light' : 'dark'));

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

function openNav() {
  mainNav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.contains('open');
  isOpen ? closeNav() : openNav();
});

// Close nav when a link is tapped
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close nav on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

// ===== STICKY HEADER EFFECT =====
const header = document.getElementById('site-header');

function onScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ===== SCROLL-SPY (active nav link) =====
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.main-nav .nav-link');

const spyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { rootMargin: '-35% 0px -60% 0px' }
);

sections.forEach(section => spyObserver.observe(section));

// ===== REVEAL ANIMATIONS =====
const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

// ===== CURSOR GLOW (desktop only) =====
const cursorGlow = document.getElementById('cursorGlow');

if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
  let raf;
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animateCursor() {
    // Smooth lerp
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    cursorGlow.style.left = `${cx}px`;
    cursorGlow.style.top  = `${cy}px`;
    raf = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hide when mouse leaves the viewport
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SKILL TAG HOVER RIPPLE =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.setProperty('--hue-shift', `${Math.random() * 40 - 20}deg`);
  });
});

// ===== PROJECT CARD TILT EFFECT =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 4;
    const rotY =  dx * 4;
    this.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});
