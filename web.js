// Lớp web chung (GitHub Pages) cho iPhone lẫn Android. Chỉ chạy khi KHÔNG có cầu nối APK (CXRAndroid).
// Thay CXRAndroid bằng Web Share API của trình duyệt, đăng ký service worker để chạy offline.
// Không chỉnh bố cục riêng cho máy nào — để điện thoại tự sắp thanh trạng thái / thanh vuốt.
(() => {
  if (window.CXRAndroid) return;
  document.documentElement.classList.add("web");

  const toFile = (name, mime, b64) => {
    const bin = atob(b64),
      u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new File([u], name, { type: mime || "application/octet-stream" });
  };
  // Tải file về (trình duyệt tự xử lý: iPhone mở xem trước, Android lưu vào Tải xuống).
  // Dùng dispatchEvent để không đi qua lớp chặn a.click() của offline.js.
  function download(file) {
    const url = URL.createObjectURL(file),
      a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  // Trình duyệt chỉ cho mở bảng chia sẻ ngay sau một lần chạm. Nếu tạo PDF lâu quá, hiện nút để chạm lại.
  function readySheet(file) {
    let d = document.getElementById("webShareSheet");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "webShareSheet";
      d.className = "m3-sheet";
      document.body.appendChild(d);
    }
    d.innerHTML = `<div class="sheet-handle"></div><h2>File đã sẵn sàng</h2><p class="sheet-file"><span><b></b><small>${Math.max(1, Math.round(file.size / 1024))} KB</small></span></p><div class="sheet-actions"><button type="button" data-act="share" class="sheet-btn primary-tonal"><span><b>Chia sẻ</b><small>Zalo, Mail, Drive, AirDrop…</small></span></button></div><div class="dialog-actions"><button type="button" class="text-btn" data-act="cancel">Đóng</button></div>`;
    d.querySelector(".sheet-file b").textContent = file.name;
    d.onclick = (e) => {
      const act = e.target.closest("button")?.dataset.act;
      if (e.target === d || act === "cancel") return d.close();
      if (act === "share") {
        d.close();
        share(file, true);
      }
    };
    d.showModal();
  }
  function share(file, retried) {
    const data = { files: [file], title: file.name };
    if (!navigator.canShare?.(data)) return download(file);
    navigator.share(data).catch((err) => {
      if (err?.name === "AbortError") return; // người dùng tự đóng bảng chia sẻ
      if (err?.name === "NotAllowedError" && !retried) return readySheet(file);
      download(file);
    });
  }

  window.CXRAndroid = {
    share: (name, mime, b64) => share(toFile(name, mime, b64)),
    save: (name, mime, b64) => download(toFile(name, mime, b64)),
    setScheme: (dark) => {
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = dark ? "#0e1513" : "#f7faf9";
    },
    version: () => 0,
    platform: "web",
  };

  // Chặn Safari phóng to cả trang bằng 2 ngón (giấy đã có zoom riêng).
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  // Xin giữ dữ liệu lâu dài (giảm nguy cơ trình duyệt tự xóa khi máy thiếu bộ nhớ).
  navigator.storage?.persist?.().catch(() => {});

  if ("serviceWorker" in navigator && (location.protocol === "https:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => {
          const w = reg.installing;
          w?.addEventListener("statechange", () => {
            if (w.state === "installed" && navigator.serviceWorker.controller && typeof notice === "function")
              notice("Đã tải bản mới · Đóng hẳn app rồi mở lại để cập nhật");
          });
        });
      }).catch(() => {});
    });
  }
})();
