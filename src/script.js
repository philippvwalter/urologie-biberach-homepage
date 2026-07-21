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
}

const anfrageDialog = document.querySelector('#anfrage-dialog');
const anfrageOpen = document.querySelector('#anfrage-open');
const anfrageCancel = document.querySelector('#anfrage-cancel');
const anfrageForm = document.querySelector('#anfrage-form');

if (anfrageDialog && anfrageOpen && anfrageCancel && anfrageForm) {
  anfrageOpen.addEventListener('click', () => {
    anfrageDialog.showModal();
  });

  anfrageCancel.addEventListener('click', () => {
    anfrageDialog.close();
  });

  anfrageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(anfrageForm);
    const anliegen = data.get('anliegen');
    const name = data.get('name');
    const email = data.get('email');
    const nachricht = data.get('nachricht');

    const subject = `${anliegen} – ${name}`;
    const body = `Anliegen: ${anliegen}\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${nachricht}`;

    const mailtoUrl = `mailto:urologie@aerztehaus-bc.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    anfrageDialog.close();
    anfrageForm.reset();
  });
}