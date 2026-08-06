const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const yearTarget = document.querySelector('#current-year');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a, button:not(.nav-dropdown-toggle)').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

const termineToggle = document.querySelector('#termine-toggle');
const termineMenu = document.querySelector('#termine-menu');

if (termineToggle && termineMenu) {
  termineToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = termineMenu.classList.toggle('is-open');
    termineToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!termineMenu.contains(event.target) && event.target !== termineToggle) {
      termineMenu.classList.remove('is-open');
      termineToggle.setAttribute('aria-expanded', 'false');
    }
  });

  termineMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      termineMenu.classList.remove('is-open');
      termineToggle.setAttribute('aria-expanded', 'false');
      termineToggle.focus();
    }
  });
}

const navTermineToggle = document.querySelector('#nav-termine-toggle');
const navTermineMenu = document.querySelector('#nav-termine-menu');

if (navTermineToggle && navTermineMenu) {
  navTermineToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navTermineMenu.classList.toggle('is-open');
    navTermineToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!navTermineMenu.contains(event.target) && event.target !== navTermineToggle) {
      navTermineMenu.classList.remove('is-open');
      navTermineToggle.setAttribute('aria-expanded', 'false');
    }
  });

  navTermineMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navTermineMenu.classList.remove('is-open');
      navTermineToggle.setAttribute('aria-expanded', 'false');
      navTermineToggle.focus();
    }
  });
}

const anfrageDialog = document.querySelector('#anfrage-dialog');
const anfrageOpen = document.querySelector('#anfrage-open');
const anfrageCancel = document.querySelector('#anfrage-cancel');
const anfrageForm = document.querySelector('#anfrage-form');
const anfrageStatus = document.querySelector('#anfrage-status');
const anfrageSend = document.querySelector('#anfrage-send');

if (anfrageDialog && anfrageOpen && anfrageCancel && anfrageForm && anfrageStatus && anfrageSend) {
  anfrageOpen.addEventListener('click', () => {
    anfrageStatus.textContent = '';
    anfrageStatus.classList.remove('is-error', 'is-success');
    anfrageDialog.showModal();
  });

  anfrageCancel.addEventListener('click', () => {
    anfrageDialog.close();
  });

  anfrageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    anfrageStatus.textContent = 'Wird gesendet …';
    anfrageStatus.classList.remove('is-error', 'is-success');
    anfrageSend.disabled = true;

    try {
      const response = await fetch('send-anfrage.php', {
        method: 'POST',
        body: new FormData(anfrageForm),
      });
      const result = await response.json();

      anfrageStatus.textContent = result.message;

      if (result.success) {
        anfrageStatus.classList.add('is-success');
        anfrageForm.reset();
        if (window.grecaptcha) window.grecaptcha.reset();
        setTimeout(() => {
          anfrageDialog.close();
          anfrageStatus.textContent = '';
        }, 2000);
      } else {
        anfrageStatus.classList.add('is-error');
        if (window.grecaptcha) window.grecaptcha.reset();
      }
    } catch (error) {
      anfrageStatus.textContent = 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.';
      anfrageStatus.classList.add('is-error');
      if (window.grecaptcha) window.grecaptcha.reset();
    } finally {
      anfrageSend.disabled = false;
    }
  });
}

const impressumDialog = document.querySelector('#impressum-dialog');
const impressumOpen = document.querySelector('#impressum-open');
const impressumClose = document.querySelector('#impressum-close');

if (impressumDialog && impressumOpen && impressumClose) {
  impressumOpen.addEventListener('click', () => {
    impressumDialog.showModal();
  });
  impressumClose.addEventListener('click', () => {
    impressumDialog.close();
  });
}

const datenschutzDialog = document.querySelector('#datenschutz-dialog');
const datenschutzOpen = document.querySelector('#datenschutz-open');
const datenschutzClose = document.querySelector('#datenschutz-close');

if (datenschutzDialog && datenschutzOpen && datenschutzClose) {
  datenschutzOpen.addEventListener('click', () => {
    datenschutzDialog.showModal();
  });
  datenschutzClose.addEventListener('click', () => {
    datenschutzDialog.close();
  });
}