document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.localized-parity .topbar-with-language .nav');
  const footerLinks = document.querySelector('.localized-parity .footer-links');
  if (!nav && !footerLinks) return;

  const headerDesktopQuery = window.matchMedia('(min-width: 1281px)');
  const footerDesktopQuery = window.matchMedia('(min-width: 1081px)');
  let resizeFrame;

  const applyBalancedLayout = (element, classPrefix, mediaQuery) => {
    if (!element) return;

    element.classList.remove(`${classPrefix}-6`, `${classPrefix}-7`);
    if (!mediaQuery.matches) return;

    const links = Array.from(element.children).filter((child) => child.matches('a'));
    if (![6, 7].includes(links.length)) return;

    const firstRowTop = links[0]?.getBoundingClientRect().top;
    const hasWrapped = links.some((link) => Math.abs(link.getBoundingClientRect().top - firstRowTop) > 1);
    if (hasWrapped) element.classList.add(`${classPrefix}-${links.length}`);
  };

  const balanceWrappedMenus = () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      applyBalancedLayout(nav, 'nav-balanced', headerDesktopQuery);
      applyBalancedLayout(footerLinks, 'footer-balanced', footerDesktopQuery);
    });
  };

  balanceWrappedMenus();
  window.addEventListener('resize', balanceWrappedMenus, { passive: true });
  document.fonts?.ready.then(balanceWrappedMenus);
});
