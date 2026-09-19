(() => {
  const measurementId = 'G-1G81C7EHDF';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  // Local previews must not create visits or conversions in production GA4.
  if (!['myshiftplanner.app', 'www.myshiftplanner.app'].includes(window.location.hostname)) return;
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  };

  window.loadSiteAnalytics = load;

  const schedule = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(load, { timeout: 2000 });
    } else {
      window.setTimeout(load, 500);
    }
  };

  const scheduleAfterPageSettles = () => window.setTimeout(schedule, 4000);
  const loadOnIntent = () => load();

  ['pointerdown', 'keydown', 'touchstart'].forEach((eventName) => {
    window.addEventListener(eventName, loadOnIntent, { once: true, passive: true });
  });

  if (document.readyState === 'complete') scheduleAfterPageSettles();
  else window.addEventListener('load', scheduleAfterPageSettles, { once: true });
})();
