const CACHE_NAME = "tobyworld-paths-v54";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./src/core.mjs",
  "./src/stages.mjs",
  "./src/progress.mjs",
  "./src/audio.mjs",
  "./src/dialogue.mjs",
  "./src/feedback.mjs",
  "./src/deed-archive.mjs",
  "./src/deed-sandbox.mjs",
  "./src/gamepad.mjs",
  "./manifest.webmanifest",
  "./assets/toby.png",
  "./assets/keepers/keeper-og.png",
  "./assets/keepers/keeper-hush.png",
  "./assets/keepers/keeper-satoby.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  const needsFreshCode = event.request.mode === "navigate" || ["script", "style", "document"].includes(event.request.destination);
  if (needsFreshCode) {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
