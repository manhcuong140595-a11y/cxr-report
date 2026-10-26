// Service worker: lưu toàn bộ app vào máy để chạy KHÔNG CẦN MẠNG sau lần mở đầu.
// d43ce51642 và ["./", "README.md", "app.js", "assets/apron.webp", "assets/chibi-plane-cursor.svg", "assets/cursor-arrow-mint.svg", "assets/cursor-arrow-pink.svg", "assets/cursor-cloud.svg", "assets/cursor-default.svg", "assets/cursor-jet.svg", "assets/cursor-lavender.svg", "assets/cursor-paper-sharp.svg", "assets/cursor-paper.svg", "assets/cursor-pink.svg", "assets/cursor-star.svg", "assets/theme-aircraft.svg", "config.js", "favicon.svg", "form-layouts.js", "form-workspace.js", "forms/bbbt/page-01.png", "forms/fsags09/page-01.png", "forms/fsags09/page-02.png", "forms/fsags208/page-01.png", "forms/fsags42.1/page-01.png", "forms/fsags42.1/page-02.png", "forms/fsags42.3/page-01.png", "forms/fsags42.3/page-02.png", "forms/fsags55.1/page-01.png", "forms/fsags55.1/page-02.png", "forms/vu/page-01.png", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "index.html", "manifest.webmanifest", "mobile-geometry.js", "mobile-nav.js", "mobile.css", "mobile.js", "offline.js", "pdf-export.js", "styles.css", "themes.css", "themes.js", "view-state.js", "web.js"] do build-pwa.sh điền. Đổi version → iPhone tải bản mới ở lần mở sau.
const CACHE = "cxr-d43ce51642";
const FILES = ["./", "README.md", "app.js", "assets/apron.webp", "assets/chibi-plane-cursor.svg", "assets/cursor-arrow-mint.svg", "assets/cursor-arrow-pink.svg", "assets/cursor-cloud.svg", "assets/cursor-default.svg", "assets/cursor-jet.svg", "assets/cursor-lavender.svg", "assets/cursor-paper-sharp.svg", "assets/cursor-paper.svg", "assets/cursor-pink.svg", "assets/cursor-star.svg", "assets/theme-aircraft.svg", "config.js", "favicon.svg", "form-layouts.js", "form-workspace.js", "forms/bbbt/page-01.png", "forms/fsags09/page-01.png", "forms/fsags09/page-02.png", "forms/fsags208/page-01.png", "forms/fsags42.1/page-01.png", "forms/fsags42.1/page-02.png", "forms/fsags42.3/page-01.png", "forms/fsags42.3/page-02.png", "forms/fsags55.1/page-01.png", "forms/fsags55.1/page-02.png", "forms/vu/page-01.png", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "index.html", "manifest.webmanifest", "mobile-geometry.js", "mobile-nav.js", "mobile.css", "mobile.js", "offline.js", "pdf-export.js", "styles.css", "themes.css", "themes.js", "view-state.js", "web.js"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("cxr-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(req, { ignoreSearch: true }).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok && res.type === "basic") c.put(req, res.clone());
            return res;
          }).catch(() => (req.mode === "navigate" ? c.match("./index.html") : Response.error())),
      ),
    ),
  );
});
