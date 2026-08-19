document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.localized-parity .topbar-with-language .nav');
  if (!nav) return;

  const desktopQuery = window.matchMedia('(min-width: 1281px)');
  let resizeFrame;

  const balanceWrappedNav = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      nav.classList.remove('nav-balanced-6', 'nav-balanced-7');
      if (!desktopQuery.matches) return;

      const links = Array.from(nav.children).filter((child) => child.matches('a'));
      if (![6, 7].includes(links.length)) return;

      const firstRowTop = links[0]?.offsetTop;
      const hasWrapped = links.some((link) => link.offsetTop !== firstRowTop);
      if (hasWrapped) nav.classList.add(`nav-balanced-${links.length}`);
    });
  };

  balanceWrappedNav();
  window.addEventListener('resize', balanceWrappedNav, { passive: true });
  document.fonts?.ready.then(balanceWrappedNav);
});
