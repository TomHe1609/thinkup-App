const PREFIX='skillyr-m02-test::';
const CACHE=PREFIX+'thinkup-learning-support-v19';
const FILES=['./','./index.html','./appearance.css','./learning-support.css','./learning-support-data.js','./learning-support.js','./study-features.js','./data-m02.json','./data-m01-m05.json','./data-m01-m09.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const OWN_URLS=new Set(FILES.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),key=url.origin+url.pathname;
 if(event.request.method!=='GET'||!key.startsWith(self.registration.scope)||!OWN_URLS.has(key))return;
 event.respondWith(fetch(event.request).then(async response=>{
  if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(key,copy)).catch(()=>{});}
  return response;
 }).catch(async()=>await caches.match(key)|| (event.request.mode==='navigate'?await caches.match(new URL('./index.html',self.registration.scope).href):null)||Response.error()));
});
