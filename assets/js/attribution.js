(function () {
  'use strict';
  const apps = { '6764406102': 'nurse', '6769349635': 'work' };
  function validCampaign(value) {
    // Labels only: never emails, visitor IDs or arbitrary URLs.
    return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,30}$/.test(value) ? value : null;
  }
  function appFromURL(url) {
    if (url.hostname !== 'apps.apple.com') return null;
    const id = url.pathname.match(/\/id(\d+)(?:\/|$)/)?.[1] || url.searchParams.get('id');
    return apps[id] || null;
  }
  function tagStoreURL(url, campaign) {
    const result = new URL(url.toString());
    const app = appFromURL(result);
    if (!app || result.pathname.startsWith('/redeem')) return result;
    result.searchParams.set('pt', '127823620');
    result.searchParams.set('ct', validCampaign(campaign) || `website_${app}`);
    result.searchParams.set('mt', '8');
    return result;
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = { validCampaign, appFromURL, tagStoreURL };
    return;
  }
  if (window.shiftPlannerAttributionInitialized) return;
  window.shiftPlannerAttributionInitialized = true;
  const params = new URLSearchParams(window.location.search);
  const explicitCampaign = validCampaign(params.get('campaign')) || validCampaign(params.get('utm_campaign'));
  const pageApp = window.location.pathname.match(/\/(nurse|work)(?:\/|$)/)?.[1];
  const campaigns = {};
  for (const app of ['nurse', 'work']) {
    let cached = null;
    try { cached = validCampaign(window.sessionStorage.getItem(`app_campaign_${app}`)); } catch (_) {}
    const explicit = explicitCampaign && (!pageApp || pageApp === app) ? explicitCampaign : null;
    campaigns[app] = { name: explicit || cached || `website_${app}`,
      basis: explicit ? 'explicit_tag' : cached ? 'session_tag' : 'website_unclassified' };
    if (explicit) {
      try { window.sessionStorage.setItem(`app_campaign_${app}`, explicit); } catch (_) {}
    }
  }
  function updateLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      const app = appFromURL(url);
      if (app) {
        link.href = tagStoreURL(url, campaigns[app].name).toString();
        return;
      }
      // Preserve a tag through same-app and language navigation, including new tabs.
      const destinationApp = url.pathname.match(/\/(nurse|work)(?:\/|$)/)?.[1];
      if (url.origin === window.location.origin && destinationApp &&
          campaigns[destinationApp].basis !== 'website_unclassified' && !url.searchParams.has('campaign')) {
        url.searchParams.set('campaign', campaigns[destinationApp].name);
        link.href = url.toString();
      }
    });
  }
  function trackClick(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    const app = appFromURL(url);
    if (!app || typeof window.gtag !== 'function') return;
    window.loadSiteAnalytics?.();
    window.gtag('event', url.pathname.startsWith('/redeem') ? 'offer_code_click' : 'app_store_click', {
      app_name: app, placement: link.dataset.appStorePlacement || 'other',
      campaign: campaigns[app].name, attribution_basis: campaigns[app].basis,
      page_language: document.documentElement.lang || 'unknown', transport_type: 'beacon'
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateLinks, { once: true });
  else updateLinks();
  document.addEventListener('click', trackClick);
  document.addEventListener('auxclick', trackClick);
})();
