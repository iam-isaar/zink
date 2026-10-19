/**
 * LinkZorven - Core Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

  function openGmailCompose(to, subject = '', body = '') {
    const composeUrl = new URL('https://mail.google.com/mail/');
    composeUrl.searchParams.set('view', 'cm');
    composeUrl.searchParams.set('fs', '1');
    composeUrl.searchParams.set('to', to);
    if (subject) composeUrl.searchParams.set('su', subject);
    if (body) composeUrl.searchParams.set('body', body);
    window.location.href = composeUrl.toString();
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const mailtoUrl = new URL(link.href);
      openGmailCompose(
        decodeURIComponent(mailtoUrl.pathname),
        mailtoUrl.searchParams.get('subject') || '',
        mailtoUrl.searchParams.get('body') || ''
      );
    });
  });

  /* ── 1. Smooth Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ── 2. Sticky Nav Scroll Effect ── */
  const header = document.getElementById('mainHeader') || document.getElementById('mainNav');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── 3. Mobile Hamburger Menu & Drawer ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMobileMenu());
    });
  }

  /* ── Active Nav Link on Scroll Spy ── */
  const sections = document.querySelectorAll('section[id]');
  const navPillLinks = document.querySelectorAll('.nav-pill-link');
  if (sections.length > 0 && navPillLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 140;
        const height = sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          current = sec.getAttribute('id');
        }
      });

      if (current) {
        navPillLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      }
    }, { passive: true });
  }

  /* ── 4. Scroll Reveal Animations ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 5. Animated Number Counters ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimal = el.dataset.decimal;
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      el.textContent = decimal ? val.toFixed(1) : Math.floor(val);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimal ? target.toFixed(1) : target;
      }
    }
    requestAnimationFrame(step);
  }

  const statSections = document.querySelectorAll('.stats-bar-grid, .hero-trust, .case-metrics-bar');
  if ('IntersectionObserver' in window && statSections.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter-val').forEach(animateCounter);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statSections.forEach(el => statObserver.observe(el));
  }

  /* ── 6. FAQ Accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !isOpen);
      });
    }
  });

  /* ── 7. Image Lightbox / Modal ── */
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  function openModal(src, captionText) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = captionText || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.zoomable-img, .case-card-img-wrap').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img') || el;
      const src = img.getAttribute('src');
      const caption = img.getAttribute('alt') || 'Google Search Console Verification';
      openModal(src, caption);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ── 8. Domain Filter Tabs ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const domainRows = document.querySelectorAll('.domain-table tbody tr');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      domainRows.forEach(row => {
        if (filter === 'all' || row.dataset.category === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  /* ── 9. Consultation Form to Email Handler ── */
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName')?.value || 'Client';
      const website = document.getElementById('formWebsite')?.value || 'N/A';
      const service = document.getElementById('formService')?.value || 'General SEO';
      const plan = document.getElementById('formPlan')?.value || 'Not specified';
      const message = document.getElementById('formMessage')?.value || '';

      const subject = `SEO Audit & Proposal Request - ${name} (${website})`;
      const body = `Hello LinkZorven Team,\n\nI would like to request an SEO audit & campaign proposal:\n\n- Name: ${name}\n- Website: ${website}\n- Service Needed: ${service}\n- Desired Plan: ${plan}\n- Additional Details: ${message}\n\nPlease review our website and get back to us with next steps.\n\nThank you!`;

      openGmailCompose('Linkzorven@gmail.com', subject, body);
    });
  }

  /* ── 10. Select Plan dynamically ── */
  window.selectPricingPlan = function(planName) {
    const planSelect = document.getElementById('formPlan');
    if (planSelect) {
      planSelect.value = planName;
    }
    const ctaSection = document.getElementById('contact');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

});
