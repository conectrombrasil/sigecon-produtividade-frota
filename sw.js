// Service worker: guarda o app no celular pra abrir sem internet.
// A CADA PUBLICAÇÃO de uma versão nova, mude o número abaixo.
// É isso que faz os celulares perceberem que há atualização.
const VERSAO = 'fc-v3.9.1';
// Fotos dos tipos de equipamento (espaço público do Storage): ficam guardadas entre versões
const FOTOS = 'fc-fotos';

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
      .then(chaves => Promise.all(chaves.filter(k => k !== VERSAO && k !== FOTOS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'pular') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fotos públicas dos equipamentos: guarda pra aparecer sem internet
  if (url.hostname.endsWith('.supabase.co') && url.pathname.includes('/storage/v1/object/public/')) {
    e.respondWith(caches.open(FOTOS).then(c => c.match(req).then(r => r || fetch(req).then(resp => { c.put(req, resp.clone()); return resp; }))));
    return;
  }
  if (url.origin !== location.origin) return;   // Supabase (login, leitura, envio, selfies) passa direto

  // Abrir o app: sempre do cache (abre na hora, com ou sem sinal)
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(r => r || fetch(req)));
    return;
  }

  // Demais arquivos: cache primeiro
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
