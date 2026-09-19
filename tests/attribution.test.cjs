const assert = require('node:assert/strict');
const test = require('node:test');
const { validCampaign, appFromURL, tagStoreURL } = require('../assets/js/attribution.js');
test('both apps get neutral campaign, provider and media tokens', () => {
  for (const [id, app] of [['6764406102', 'nurse'], ['6769349635', 'work']]) {
    const result = tagStoreURL(new URL(`https://apps.apple.com/app/example/id${id}`));
    assert.equal(result.searchParams.get('ct'), `website_${app}`);
    assert.equal(result.searchParams.get('pt'), '127823620');
    assert.equal(result.searchParams.get('mt'), '8');
  }
});
test('explicit email campaign replaces stale defaults and preserves other parameters', () => {
  const result = tagStoreURL(new URL('https://apps.apple.com/app/apple-store/id6764406102?ct=instantly_us_nurses&ppid=example'), 'instantly_au_nurses');
  assert.equal(result.searchParams.get('ct'), 'instantly_au_nurses');
  assert.equal(result.searchParams.get('ppid'), 'example');
});
test('rejects malformed or personal-data campaign labels', () => {
  for (const value of [null, '', 'someone@example.com', 'https://example.com', 'a'.repeat(31), 'campaign name']) {
    assert.equal(validCampaign(value), null);
  }
  assert.equal(validCampaign('instantly_de_nurses'), 'instantly_de_nurses');
});
test('redemption and unrelated URLs remain unchanged', () => {
  for (const href of ['https://apps.apple.com/redeem/?ctx=offercodes&id=6764406102&code=NURSESHIFT50', 'https://apps.apple.com/app/id123', 'https://example.com/app/id6764406102']) {
    assert.equal(tagStoreURL(new URL(href), 'email_campaign').toString(), href);
  }
  assert.equal(appFromURL(new URL('https://example.com/app/id6764406102')), null);
});
const vm = require('node:vm');
const fs = require('node:fs');
const script = fs.readFileSync(require.resolve('../assets/js/attribution.js'), 'utf8');
function visit(path, storage = new Map(), blockedStorage = false) {
  const location = new URL(path, 'https://myshiftplanner.app');
  const events = [], listeners = {};
  const anchors = ['https://apps.apple.com/app/id6764406102', 'https://apps.apple.com/app/id6769349635', '/nurse/healthcarestaffdiscount/', '/de/nurse/', '/work/', 'https://apps.apple.com/redeem/?id=6764406102&code=NURSESHIFT50'].map(href => ({href, dataset:{appStorePlacement:'hero'}, getAttribute:()=>href}));
  const window = {location, gtag:(...args)=>events.push(args), sessionStorage:{
    getItem:key=>{if(blockedStorage) throw Error('blocked'); return storage.get(key);},
    setItem:(key,value)=>{if(blockedStorage) throw Error('blocked'); storage.set(key,value);}
  }};
  const document = {readyState:'complete',documentElement:{lang:'en'}, querySelectorAll:()=>anchors, addEventListener:(name,fn)=>{listeners[name]=fn;}};
  vm.runInNewContext(script,{window,document,URL,URLSearchParams});
  return {anchors,events,listeners,storage};
}
test('campaign survives navigation but does not leak to the other app',()=>{
  const first=visit('/nurse/?campaign=instantly_au_nurses');
  assert.equal(new URL(first.anchors[0].href).searchParams.get('ct'),'instantly_au_nurses');
  assert.equal(new URL(first.anchors[1].href).searchParams.get('ct'),'website_work');
  assert.match(first.anchors[2].href,/campaign=instantly_au_nurses/);
  assert.match(first.anchors[3].href,/campaign=instantly_au_nurses/);
  assert.equal(first.anchors[4].href,'/work/');
  const next=visit('/nurse/healthcarestaffdiscount/',first.storage);
  assert.equal(new URL(next.anchors[0].href).searchParams.get('ct'),'instantly_au_nurses');
});
test('blocked storage preserves explicit tags and untagged visits stay neutral',()=>{
  const tagged=visit('/de/nurse/?utm_campaign=instantly_de_nurses',new Map(),true);
  assert.equal(new URL(tagged.anchors[0].href).searchParams.get('ct'),'instantly_de_nurses');
  const direct=visit('/de/nurse/');
  assert.equal(new URL(direct.anchors[0].href).searchParams.get('ct'),'website_nurse');
});
test('one click gives one event and redemption is not a download',()=>{
  const page=visit('/nurse/');
  page.listeners.click({type:'click',target:{closest:()=>page.anchors[0]}});
  page.listeners.auxclick({type:'auxclick',button:2,target:{closest:()=>page.anchors[0]}});
  assert.equal(page.events.length,1);
  assert.equal(page.events[0][1],'app_store_click');
  assert.equal(page.events[0][2].attribution_basis,'website_unclassified');
  page.listeners.click({type:'click',target:{closest:()=>page.anchors[5]}});
  assert.equal(page.events[1][1],'offer_code_click');
});
