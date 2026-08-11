/* ==========================================================================
   GREEN VALLEY INTERNATIONAL SCHOOL — main.js
   Mobile menu | Sticky header | Smooth scroll | Active nav
   Scroll reveal | Animated counters | Back to top | Form validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. STICKY HEADER ON SCROLL
  --------------------------------------------------- */
  const header = document.querySelector('.header');
  const onScrollHeader = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------------------------------------------
     2. MOBILE MENU TOGGLE
  --------------------------------------------------- */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav');
  const headerBtns = document.querySelector('.header-btns');
  const navOverlay = document.querySelector('.nav-overlay');

  const closeMobileNav = () => {
    nav.classList.remove('mobile-open');
    headerBtns.classList.remove('mobile-open');
    navOverlay?.classList.remove('show');
    document.body.style.overflow = '';
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    nav.querySelectorAll('.has-dropdown.open').forEach(li => li.classList.remove('open'));
  };

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      headerBtns.classList.toggle('mobile-open', isOpen);
      navOverlay?.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      menuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // on mobile, tapping a dropdown parent (Academics / More) expands it
    // instead of navigating away; on desktop this listener is a no-op
    // since the dropdown already opens on hover via CSS.
    nav.querySelectorAll('.has-dropdown > a').forEach(parentLink => {
      parentLink.addEventListener('click', (e) => {
        const href = parentLink.getAttribute('href');
        const hasRealTarget = href.startsWith('#') && document.querySelector(href);

        if (window.innerWidth > 960) {
          // desktop: dropdown already opens on hover; only block navigation
          // for parents (like "More") that have no matching in-page section
          if (!hasRealTarget) e.preventDefault();
          return;
        }

        e.preventDefault();
        const li = parentLink.parentElement;
        const wasOpen = li.classList.contains('open');
        nav.querySelectorAll('.has-dropdown.open').forEach(item => item.classList.remove('open'));
        li.classList.toggle('open', !wasOpen);
      });
    });

    // close menu when a plain nav link (not a dropdown parent) is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (link.parentElement.classList.contains('has-dropdown') && window.innerWidth <= 960) return;
        closeMobileNav();
      });
    });

    // close on overlay click
    navOverlay?.addEventListener('click', closeMobileNav);

    // close menu on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('mobile-open')) {
        closeMobileNav();
      }
    });

    // close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('mobile-open')) closeMobileNav();
    });
  }

  /* ---------------------------------------------------
     3. SMOOTH SCROLL + ACTIVE NAV LINK ON CLICK
  --------------------------------------------------- */
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = header.offsetHeight + 10;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  /* ---------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL (scrollspy)
  --------------------------------------------------- */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(sec => spyObserver.observe(sec));
  }

  /* ---------------------------------------------------
     5. AUTO-TAG REVEAL ELEMENTS + SCROLL REVEAL ANIMATION
  --------------------------------------------------- */
  const autoRevealSelectors = [
    '.academic-card', '.choose-card', '.news-card', '.admission-card',
    '.testimonial-card', '.gallery-item', '.contact-box', '.feature-item',
    '.about-image', '.about-content', '.campus-content', '.campus-video',
    '.stat-card'
  ];

  autoRevealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'up');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
      }
    });
  });

  const revealTargets = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     6. ANIMATED NUMBER COUNTERS
  --------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const isPercent = el.nextElementSibling && /%/.test(el.nextElementSibling.textContent);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.floor(eased * target);
      el.textContent = value + (isPercent ? '%' : (progress >= 1 && target >= 100 ? '+' : ''));
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + (isPercent ? '%' : (target >= 10 ? '+' : ''));
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------------------------------------------------
     7. BACK TO TOP BUTTON
  --------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 480);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------
     8. CONTACT FORM VALIDATION
  --------------------------------------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    // insert a message box + loading state on the button
    const sendBtn = form.querySelector('.send-btn');
    const msgBox = document.createElement('div');
    msgBox.className = 'form-msg';
    form.appendChild(msgBox);

    const showMsg = (text, type) => {
      msgBox.textContent = text;
      msgBox.className = `form-msg show ${type}`;
    };

    const validators = {
      name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
      phone: (v) => /^[0-9+\-\s()]{7,15}$/.test(v.trim()) || 'Please enter a valid phone number.',
      message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
    };

    Object.keys(validators).forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      field.addEventListener('blur', () => {
        const result = validators[name](field.value);
        field.classList.toggle('field-error', result !== true);
      });
      field.addEventListener('input', () => field.classList.remove('field-error'));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      let firstError = '';

      Object.keys(validators).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        const result = validators[name](field.value);
        if (result !== true) {
          valid = false;
          field.classList.add('field-error');
          if (!firstError) firstError = result;
        } else {
          field.classList.remove('field-error');
        }
      });

      if (!valid) {
        showMsg(firstError, 'error');
        return;
      }

      // simulate submission
      const originalText = sendBtn.textContent;
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';

      setTimeout(() => {
        showMsg('Thank you! Your message has been sent. We will get back to you shortly.', 'success');
        form.reset();
        sendBtn.disabled = false;
        sendBtn.textContent = originalText;
      }, 1200);
    });
  }

  /* ---------------------------------------------------
     9. GALLERY LIGHTBOX (simple click-to-zoom)
  --------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (galleryItems.length) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(18,40,31,0.92);
      display: none; align-items: center; justify-content: center;
      z-index: 2000; padding: 30px; cursor: zoom-out;
    `;
    const overlayImg = document.createElement('img');
    overlayImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);';
    overlay.appendChild(overlayImg);
    document.body.appendChild(overlay);

    galleryItems.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        overlayImg.src = img.src;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
 /* ---------------------------------------------------
   new javascript code new section
  --------------------------------------------------- */

   document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var q = item.querySelector('.accordion-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
});

});
