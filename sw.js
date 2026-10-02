// Service worker: guarda o app no celular pra abrir sem internet.
// A CADA PUBLICAÇÃO de uma versão nova, mude o número abaixo.
// É isso que faz os celulares perceberem que há atualização.
const VERSAO = 'fc-v3.2.1';

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './supabase.js',
  './icone.svg',
  './icone-180.png',
  './icone-192.png',
  './icone-512.png',
  './icone-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(chaves.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'pular') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // Supabase (login, leitura e envio) passa direto

  // Abrir o app: sempre do cache (abre na hora, com ou sem sinal)
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(r => r || fetch(req)));
    return;
  }

  // Demais arquivos: cache primeiro
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
