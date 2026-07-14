/* ============================================================
   LAVAGE AUTO À DOMICILE MONTPELLIER — Interactions
   Vanilla JS, sans dépendance.
   ============================================================ */
(function () {
  'use strict';

  /* --- 1. Menu mobile --- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });
  }

  /* --- 2. Header au scroll + bouton retour en haut --- */
  const header = document.querySelector('.site-header');
  const toTop = document.getElementById('toTop');
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- 3. Apparition au scroll --- */
  const reveals = document.querySelectorAll('.reveal, .rx');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* --- 4. FAQ : accordéon à ouverture unique --- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* --- 4b. « Comment ça marche » (Pattern C) : accordéon numéroté,
          toujours exactement une étape ouverte --- */
  const steps = document.querySelectorAll('#steps .step');
  steps.forEach(function (step) {
    const sum = step.querySelector('summary');
    if (sum) {
      sum.addEventListener('click', function (e) {
        // Étape déjà ouverte → on empêche sa fermeture (une reste toujours ouverte)
        if (step.open) e.preventDefault();
      });
    }
    step.addEventListener('toggle', function () {
      if (step.open) {
        steps.forEach(function (other) {
          if (other !== step) other.open = false;
        });
      }
    });
  });

  /* --- 5. Validation du formulaire de réservation --- */
  const form = document.getElementById('devisForm');
  const success = document.getElementById('formSuccess');

  function setError(field, message) {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.add('err');
    const help = wrap.querySelector('.help');
    if (help) help.textContent = message;
  }
  function clearError(field) {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.remove('err');
    const help = wrap.querySelector('.help');
    if (help) help.textContent = '';
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[+()0-9.\s-]{9,}$/;

  if (form) {
    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', function () { clearError(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot anti-spam : si rempli, on ignore silencieusement.
      const hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== '') return;

      let valid = true;
      const name = form.elements['name'];
      const phone = form.elements['phone'];
      const email = form.elements['email'];
      const message = form.elements['message'];

      if (!name.value.trim()) { setError(name, 'Merci d\'indiquer votre nom.'); valid = false; }
      if (!phoneRe.test(phone.value.trim())) { setError(phone, 'Numéro de téléphone invalide.'); valid = false; }
      if (!emailRe.test(email.value.trim())) { setError(email, 'Merci d\'indiquer un email valide.'); valid = false; }
      if (message.value.trim().length < 5) { setError(message, 'Précisez l\'adresse et votre besoin.'); valid = false; }

      if (!valid) {
        const firstErr = form.querySelector('.field.err input, .field.err textarea, .field.err select');
        if (firstErr) firstErr.focus();
        return;
      }

      // Simulation d'envoi — brancher ici un vrai endpoint (fetch POST) le moment venu.
      const submitBtn = form.querySelector('.form-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…'; }

      setTimeout(function () {
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Recevoir mon devis'; }
      }, 700);
    });
  }

  /* --- 6. Année courante --- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
