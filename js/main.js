/* ═══════════════════════════════════════════════
   Hideaway Coffee House — main.js
   ═══════════════════════════════════════════════ */

'use strict';

// ── DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHamburger();
  initReveal();
  initContactForm();
  setYear();
  initSmoothScrollNav();
});


// ── Sticky header ──────────────────────────────
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


// ── Mobile hamburger ───────────────────────────
function initHamburger() {
  const btn     = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', false);
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', true);
    });
  });
}


// ── Scroll reveal ──────────────────────────────
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // Stagger siblings in the same parent
  const applyStagger = (entries) => {
    const byParent = new Map();
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        if (!byParent.has(parent)) byParent.set(parent, []);
        byParent.get(parent).push(entry.target);
      }
    });

    byParent.forEach(siblings => {
      siblings.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 100);
      });
    });
  };

  const observer = new IntersectionObserver(applyStagger, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}


// ── Smooth scroll for anchors ──────────────────
function initSmoothScrollNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // header height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ── Contact form ───────────────────────────────
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn-text');
    const original  = btnText.textContent;

    // Check if Formspree ID is set
    const action = form.getAttribute('action');
    if (action.includes('YOUR_FORM_ID')) {
      alert('⚠️ Please replace YOUR_FORM_ID in the form action with your Formspree ID.\n\nVisit https://formspree.io to get a free form endpoint.');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.hidden = true;
        success.hidden = false;
      } else {
        const json = await res.json();
        throw new Error(json.error || 'Submission failed');
      }
    } catch (err) {
      btnText.textContent = 'Error — try again';
      submitBtn.disabled = false;
      console.error('Form error:', err);
      setTimeout(() => { btnText.textContent = original; }, 3000);
    }
  });
}


// ── Footer year ────────────────────────────────
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
