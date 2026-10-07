// Vistoria de Equipamentos — guarda o app no celular pra abrir sem internet.
// Ao publicar uma versão nova do app, aumente o número abaixo.
const CACHE = 'vistoria-equip-v1';
const ARQUIVOS = ['./', './index.html', './supabase.js', './manifest.json', './icone.svg', './icone-180.png', './icone-192.png', './icone-512.png', './icone-maskable-512.png'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('message', e=>{ if (e.data==='pular') self.skipWaiting(); });
self.addEventListener('fetch', e=>{
  const req = e.request;
  if (req.method!=='GET') return;
  const url = new URL(req.url);
  if (url.origin!==location.origin) return;            // Supabase e fotos: sempre pela rede
  if (req.mode==='navigate') {                         // a página: rede primeiro, cópia guardada se estiver sem sinal
    e.respondWith(fetch(req).then(r=>{ const c = r.clone(); caches.open(CACHE).then(x=>x.put('./index.html', c)); return r; }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r || fetch(req)));
});
