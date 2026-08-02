document.addEventListener('DOMContentLoaded', () => {
  const languageSummary = document.querySelector('.language-menu summary');
  const languageCode = document.documentElement.lang.toLowerCase().split('-')[0];
  const shortLanguageNames = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE', pt: 'PT', ja: 'JA' };

  if (languageSummary && shortLanguageNames[languageCode]) {
    languageSummary.textContent = shortLanguageNames[languageCode];
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
});
