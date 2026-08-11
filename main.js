// ============================================================
// TNT LEGACY SHIELD — main.js
// ============================================================

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileMenuClose && mobileMenu) {
  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
}
document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Quote form handling
// -----------------------------------------------------------
// NOTE FOR DARRELL: GitHub Pages cannot process form submissions
// on its own (it's static hosting, no server). To make this form
// actually deliver leads to your inbox, sign up free at
// https://formspree.io, create a form, and replace the
// YOUR_FORMSPREE_ID below with the ID they give you. That's it,
// no other code changes needed.
// -----------------------------------------------------------
const quoteForm = document.getElementById('quote-form');
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';

if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = quoteForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(quoteForm);

    try {
      if (FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ID')) {
        // Formspree not yet connected — demo confirmation only.
        await new Promise((res) => setTimeout(res, 700));
        showFormSuccess();
      } else {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          showFormSuccess();
        } else {
          throw new Error('Submission failed');
        }
      }
    } catch (err) {
      submitBtn.textContent = 'Something went wrong, call us instead';
      submitBtn.disabled = false;
    }

    function showFormSuccess() {
      quoteForm.innerHTML =
        '<div style="text-align:center; padding: 40px 10px;">' +
        '<h3 style="font-family: var(--font-display); color:#fff; font-size:22px; margin-bottom:10px;">Request received.</h3>' +
        '<p style="color: rgba(255,255,255,0.7); font-size: 14.5px;">We will reach out within one business day to talk through your coverage options. No pressure, no jargon.</p>' +
        '</div>';
    }
  });
}
