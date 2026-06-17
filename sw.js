const CACHE = 'oneclick-crm-v4';
const ASSETS = ['/', '/index.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  // nunca cachear API, Supabase nem chamadas externas dinâmicas
  if (url.includes('crm-api.oneclicksolucoes.com.br') ||
      url.includes('supabase.co') ||
      url.includes('api.anthropic.com') ||
      e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
