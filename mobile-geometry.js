// Pure view geometry; never changes report coordinates or PDF font metrics.
window.CXRMobileGeometry = {
  clamp: (n, min, max) => Math.max(min, Math.min(max, n)),
  centeredScroll: (scroll, start, size, viewportStart, viewportSize) =>
    Math.max(0, scroll + start + size / 2 - viewportStart - viewportSize / 2),
  pinchWidth: (width, distance, startDistance, min) =>
    Math.max(
      min,
      Math.min(1800, (width * distance) / Math.max(1, startDistance)),
    ),
  // "Vừa ngang": phóng giấy sao cho phần nội dung (bỏ lề trắng của mẫu in)
  // vừa khít bề ngang màn hình. left/right là tỉ lệ 0–1 theo bề ngang trang.
  contentFit: (viewport, left, right, margin = 6) => {
    const span = Math.max(0.3, Math.min(1, right - left));
    const width = Math.min(1800, (viewport - 2 * margin) / span);
    return { width, scrollLeft: Math.max(0, left * width - margin) };
  },
  // Gộp vùng nội dung của ảnh mẫu với vị trí các ô nhập (x, w theo %),
  // để không bao giờ cắt mất ô nhập ở mép giấy.
  unionBounds: (imageBounds, fields) => {
    let left = 1,
      right = 0;
    for (const b of imageBounds) {
      if (!b) continue;
      left = Math.min(left, b.left);
      right = Math.max(right, b.right);
    }
    for (const f of fields || []) {
      if (!(f.w >= 1 && f.h >= 0.8)) continue; // bỏ ô ẩn/ô giữ chỗ
      left = Math.min(left, f.x / 100);
      right = Math.max(right, (f.x + f.w) / 100);
    }
    if (right <= left) return { left: 0, right: 1 };
    return { left: Math.max(0, left - 0.01), right: Math.min(1, right + 0.01) };
  },
  // Dò ô kẻ đen bao quanh một ô nhập trên ảnh mẫu.
  // dark: Uint8Array (1 = điểm tối) kích thước W×H; box: vùng ô nhập theo pixel ảnh.
  // Trả về {left, top, right, bottom} là tâm các đường kẻ, hoặc null nếu không phải ô kẻ.
  findCell: (dark, W, H, box) => {
    const at = (x, y) => dark[y * W + x];
    const fw = Math.max(4, box.x1 - box.x0),
      fh = Math.max(4, box.y1 - box.y0);
    const cx = Math.round((box.x0 + box.x1) / 2),
      cy = Math.round((box.y0 + box.y1) / 2);
    if (cx < 0 || cx >= W || cy < 0 || cy >= H) return null;
    const half = Math.max(30, fw / 2),
      thr = Math.max(14, Math.min(40, fw * 0.6));
    const hRun = (y) => {
      let best = 0,
        run = 0;
      for (let x = Math.max(0, cx - half); x <= Math.min(W - 1, cx + half); x++) {
        run = at(Math.round(x), y) ? run + 1 : 0;
        if (run > best) best = run;
      }
      return best >= thr;
    };
    const lineV = (from, step, limit) => {
      for (let y = from; y >= 0 && y < H && Math.abs(y - from) <= limit; y += step)
        if (hRun(y)) {
          let e = y;
          while (e + step >= 0 && e + step < H && Math.abs(e + step - y) < 8 && hRun(e + step)) e += step;
          // Nét kẻ mảnh (≤4px) → lấy tâm nét; mảng đen đặc → lấy đúng mép mảng.
          return Math.abs(e - y) + 1 <= 4 ? (y + e) / 2 : y;
        }
      return null;
    };
    const maxV = Math.max(3 * fh, 60);
    const top = lineV(cy, -1, maxV),
      bottom = lineV(cy, 1, maxV);
    if (top == null || bottom == null) return null;
    const h = bottom - top;
    if (h < fh * 0.5 || h > fh * 6 + 60) return null;
    const ya = Math.round(top + 3),
      yb = Math.round(bottom - 3);
    if (yb - ya < 3) return null;
    const vCov = (x) => {
      let n = 0;
      for (let y = ya; y <= yb; y++) n += at(x, y);
      return n / (yb - ya + 1) >= 0.9;
    };
    const lineH = (from, step, limit) => {
      for (let x = from; x >= 0 && x < W && Math.abs(x - from) <= limit; x += step)
        if (vCov(x)) {
          let e = x;
          while (e + step >= 0 && e + step < W && Math.abs(e + step - x) < 8 && vCov(e + step)) e += step;
          return Math.abs(e - x) + 1 <= 4 ? (x + e) / 2 : x;
        }
      return null;
    };
    const maxH = fw + 220;
    let left = lineH(cx, -1, maxH),
      right = lineH(cx, 1, maxH);
    if (left == null) left = box.x0;
    if (right == null) right = box.x1;
    if (right - left < 6) return null;
    return { left, top, right, bottom };
  },
};
