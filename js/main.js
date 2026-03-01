/**
 * Saraland Baptist Church — Main JavaScript
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Footer year
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Mobile navigation toggle
  ---------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     About dropdown (desktop hover is CSS; this handles
     click for keyboard / mobile)
  ---------------------------------------------------------- */
  const aboutBtn      = document.getElementById('about-btn');
  const aboutDropdown = document.getElementById('about-dropdown');

  if (aboutBtn && aboutDropdown) {
    aboutBtn.addEventListener('click', function () {
      const expanded = aboutBtn.getAttribute('aria-expanded') === 'true';
      aboutBtn.setAttribute('aria-expanded', String(!expanded));
      aboutDropdown.classList.toggle('open', !expanded);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!aboutBtn.contains(e.target) && !aboutDropdown.contains(e.target)) {
        aboutBtn.setAttribute('aria-expanded', 'false');
        aboutDropdown.classList.remove('open');
      }
    });
  }

  /* ----------------------------------------------------------
     Contact form — basic client-side validation + mock submit
  ---------------------------------------------------------- */
  const contactForm  = document.getElementById('contact-form');
  const formSuccess  = document.getElementById('form-success');
  const formError    = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous messages
      if (formSuccess) formSuccess.style.display = 'none';
      if (formError)   formError.style.display   = 'none';

      // Basic validation
      const firstName = contactForm.querySelector('#first-name');
      const lastName  = contactForm.querySelector('#last-name');
      const email     = contactForm.querySelector('#email');
      const message   = contactForm.querySelector('#message');

      const requiredFields = [firstName, lastName, email, message].filter(Boolean);
      const hasEmpty = requiredFields.some(function (f) {
        return !f.value.trim();
      });

      if (hasEmpty) {
        if (formError) formError.style.display = 'block';
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        if (formError) {
          formError.textContent = 'Please enter a valid email address.';
          formError.style.display = 'block';
        }
        return;
      }

      // Show success (in production this would POST to a server or Formspree etc.)
      if (formSuccess) formSuccess.style.display = 'block';
      contactForm.reset();
    });
  }

  /* ----------------------------------------------------------
     Smooth scroll for anchor links on the same page
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('site-header')
          ? document.getElementById('site-header').offsetHeight
          : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     Sticky header shadow on scroll
  ---------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,0.4)'
        : '0 2px 10px rgba(0,0,0,0.3)';
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Simple fade-in on scroll for cards / ministry cards
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.card, .ministry-card, .staff-card, .service-time-card, .action-card');

    fadeEls.forEach(function (el) {
      el.style.opacity  = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) { observer.observe(el); });
  }

})();
