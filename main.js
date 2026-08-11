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

// Lead form handling (Get A Quote / Join The Team / Contact)
// -----------------------------------------------------------
// Each form on the site carries its own data-endpoint attribute
// pointing at its Formspree form, so submissions land in the
// right inbox with the right subject line automatically:
//   Get A Quote      -> https://formspree.io/f/xeajgnlb
//   Join The Team    -> https://formspree.io/f/moeadrng
//   Contact Us       -> https://formspree.io/f/xvkpalwz
// All three deliver to info@tntlegacyshield.com.
// -----------------------------------------------------------
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID'; // fallback only, unused now that every form has data-endpoint

document.querySelectorAll('.js-lead-form').forEach((formEl) => {
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = formEl.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(formEl);
    const endpoint = formEl.dataset.endpoint || FORMSPREE_ENDPOINT;

    try {
      if (endpoint.includes('YOUR_FORMSPREE_ID')) {
        // Formspree not yet connected — demo confirmation only.
        await new Promise((res) => setTimeout(res, 700));
        showFormSuccess();
      } else {
        const response = await fetch(endpoint, {
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
      formEl.innerHTML =
        '<div style="text-align:center; padding: 40px 10px;">' +
        '<h3 style="font-family: var(--font-display); text-transform:none; color: inherit; font-size:22px; margin-bottom:10px;">Request received.</h3>' +
        '<p style="opacity:0.75; font-size: 14.5px;">We will reach out within one business day. No pressure, no jargon.</p>' +
        '</div>';
    }
  });
});

// Quote page: pre-select coverage type from ?coverage= query param
// (used by the links on the Products page)
const coverageSelect = document.getElementById('coverage');
if (coverageSelect) {
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get('coverage');
  if (wanted) {
    [...coverageSelect.options].forEach((opt) => {
      if (opt.value.toLowerCase() === wanted.toLowerCase()) {
        coverageSelect.value = opt.value;
      }
    });
  }
}
