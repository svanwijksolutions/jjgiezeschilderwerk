/* ============================================================
   J.J. Gieze Schilderwerk — script.js
   Bevat: component loader, header scroll, mobiel menu,
          actieve nav, fade-in animaties, formulier handling
   ============================================================ */

/* ——— 1. COMPONENT LOADER ——— */
async function loadComponent(id, path) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Kon ${path} niet laden (${res.status})`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error('Component laad-fout:', err);
  }
}

/* ——— 2. HEADER SCROLL EFFECT ——— */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // direct uitvoeren bij laden
}

/* ——— 3. MOBIEL MENU ——— */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Sluit menu bij klik op link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Sluit menu bij Escape-toets
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}

/* ——— 4. ACTIEVE NAV MARKERING ——— */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ——— 5. FADE-IN ANIMATIES (IntersectionObserver) ——— */
function initAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ——— 6. CONTACT FORMULIER ——— */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('form-success');
    const originalText = btn.textContent;

    btn.textContent = 'Verzenden...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        if (successMsg) {
          successMsg.classList.add('show');
          successMsg.focus();
          setTimeout(() => successMsg.classList.remove('show'), 6000);
        }
      } else {
        alert('Er is iets misgegaan. Probeer het opnieuw of stuur een e-mail naar jeffrie@gieze.com');
      }
    } catch {
      alert('Geen verbinding. Neem direct contact op via jeffrie@gieze.com of 06 2460 6967.');
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
}

/* ——— 7. BOOTSTRAP — alles na laden van componenten ——— */
async function init() {
  // Laad header en footer parallel
  await Promise.all([
    loadComponent('header-placeholder', 'components/header.html'),
    loadComponent('footer-placeholder', 'components/footer.html'),
  ]);

  // Init functies die afhankelijk zijn van geladen componenten
  initHeaderScroll();
  initMobileNav();
  initActiveNav();
  initAnimations();
  initContactForm();
}

document.addEventListener('DOMContentLoaded', init);