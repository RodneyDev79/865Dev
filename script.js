// 865Dev Interactive Features & Performance Script

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSpeedCounterAnimation();
  initContactForm();
  initMobileMenu();
});

// Navbar background elevation on scroll
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Counter animation for 100/100 PageSpeed metric
function initSpeedCounterAnimation() {
  const counterEl = document.getElementById('speedCounter');
  if (!counterEl) return;

  let hasAnimated = false;
  const target = 100;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounter(counterEl, 0, target, 1600);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(counterEl);
}

function animateCounter(el, start, end, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeProgress * (end - start) + start);
    el.textContent = currentValue;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = end;
    }
  }

  window.requestAnimationFrame(step);
}

// Interactive Quote Calculator logic
function updateCalc() {
  const baseBuild = 1500;
  let total = baseBuild;

  const chkGbp = document.getElementById('chkGbp');
  const chkExtraPage = document.getElementById('chkExtraPage');
  const chkReviews = document.getElementById('chkReviews');
  const chkCustomIntegration = document.getElementById('chkCustomIntegration');

  const optGbp = document.getElementById('optGbp');
  const optExtraPage = document.getElementById('optExtraPage');
  const optReviews = document.getElementById('optReviews');
  const optCustomIntegration = document.getElementById('optCustomIntegration');

  if (chkGbp && chkGbp.checked) {
    total += 250;
    optGbp.classList.add('active');
  } else if (optGbp) {
    optGbp.classList.remove('active');
  }

  if (chkExtraPage && chkExtraPage.checked) {
    total += 300;
    optExtraPage.classList.add('active');
  } else if (optExtraPage) {
    optExtraPage.classList.remove('active');
  }

  if (chkReviews && chkReviews.checked) {
    total += 150;
    optReviews.classList.add('active');
  } else if (optReviews) {
    optReviews.classList.remove('active');
  }

  if (chkCustomIntegration && chkCustomIntegration.checked) {
    total += 285;
    optCustomIntegration.classList.add('active');
  } else if (optCustomIntegration) {
    optCustomIntegration.classList.remove('active');
  }

  const calcTotalEl = document.getElementById('calcTotal');
  if (calcTotalEl) {
    calcTotalEl.textContent = `$${total.toLocaleString()}`;
  }
}

// Contact Form submission handling with client validation, API dispatch & toast modal
function initContactForm() {
  const leadForm = document.getElementById('leadForm');
  if (!leadForm) return;

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot anti-bot check
    const hpField = leadForm.querySelector('input[name="website_url_hp"]');
    if (hpField && hpField.value !== '') {
      console.warn('Bot submission blocked.');
      return;
    }

    const name = document.getElementById('fullName').value.trim();
    const business = document.getElementById('businessName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const tradeType = document.getElementById('tradeType') ? document.getElementById('tradeType').value : 'Home Services & Trades';
    const projectDetails = document.getElementById('projectDetails') ? document.getElementById('projectDetails').value.trim() : '';
    const calcTotalEl = document.getElementById('calcTotal');
    const estimateTotal = calcTotalEl ? calcTotalEl.textContent.trim() : '$1,500';

    if (!name || !business || !phone || !email) {
      alert('Please fill out all required fields (*)');
      return;
    }

    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Quote Request...';
    }

    try {
      const formData = new FormData();
      formData.append('fullName', name);
      formData.append('businessName', business);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('tradeType', tradeType);
      formData.append('projectDetails', projectDetails);
      formData.append('estimateTotal', estimateTotal);
      formData.append('website_url_hp', hpField ? hpField.value : '');

      await fetch('/api/contact.php', {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.warn('Contact API dispatch fallback:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      // Display confirmation modal
      const toastMsg = document.getElementById('toastMessage');
      if (toastMsg) {
        toastMsg.innerHTML = `Thanks <strong>${name}</strong> from <strong>${business}</strong>! We've received your request for an 865Dev static build. A Knoxville developer will call or email you shortly.`;
      }

      const toastModal = document.getElementById('toastModal');
      if (toastModal) {
        toastModal.classList.add('active');
      }

      leadForm.reset();
      updateCalc();
    }
  });
}

function closeToastModal() {
  const toastModal = document.getElementById('toastModal');
  if (toastModal) {
    toastModal.classList.remove('active');
  }
}

// Mobile navigation menu toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderBottom = '1px solid #E2E8F0';
      navLinks.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.1)';
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

// Pre-fill business category dropdown when requesting a specific industry build
function selectTradeCategory(category) {
  const tradeSelect = document.getElementById('tradeType');
  if (tradeSelect) {
    tradeSelect.value = category;
  }
}
