// APK-only UI layer (0.3). Không đổi tọa độ ô, dữ liệu hay logic xuất PDF.
(() => {
  const G = CXRMobileGeometry;
  const READABLE_WIDTH = 860; // bề ngang giấy khi đang nhập: chữ ~13px, dễ đọc
  const EDGE = 6; // lề hai bên khi canh "Vừa ngang"

  // ---------- Icons (Material Symbols, Apache 2.0) ----------
  const P = {
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    flight:
      "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
    settings:
      "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z",
    back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z",
    info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z",
    form: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
    attach:
      "M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z",
    remove: "M19 13H5v-2h14z",
    chevron: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
    prev: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    kbHide:
      "M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 3h2v2h-2zm0 3h2v2h-2zM8 6h2v2H8zm0 3h2v2H8zM7 11H5V9h2zm0-3H5V6h2zm9 6H8v-2h8zm0-3h-2V9h2zm0-3h-2V6h2zm3 3h-2V9h2zm0-3h-2V6h2zm-7 15 4-4H8z",
    fitW: "M3 5v14h2V5zm16 0v14h2V5zM7.5 12l3 3v-2h3v2l3-3-3-3v2h-3V9z",
    fitP: "M17 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H7V6h10z",
    light:
      "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2zm18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2zM11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0zm0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0zM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41zm1.06-10.96a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41zM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41z",
    dark: "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z",
    check: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    share:
      "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11A2.99 2.99 0 1 0 15 5c0 .24.04.47.09.7L8.04 9.81a3 3 0 1 0 0 4.38l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 1 0 2.92-2.92z",
    download: "M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z",
  };
  const icon = (name, cls = "") =>
    `<svg class="m3-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[name]}"/></svg>`;
  window.CXRIcon = icon;

  // ---------- Sáng / Tối ----------
  const SCHEME_KEY = "cxr-mobile-scheme";
  function scheme() {
    try {
      return localStorage.getItem(SCHEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  }
  function applyScheme() {
    document.documentElement.dataset.scheme = scheme();
    try {
      window.CXRAndroid?.setScheme?.(scheme() === "dark");
    } catch {}
  }
  applyScheme();
  // Thay hộp "Chủ đề" (5 theme web) bằng lựa chọn Sáng/Tối kiểu Android.
  openThemes = function () {
    let d = document.getElementById("schemeDialog");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "schemeDialog";
      document.body.appendChild(d);
    }
    const cur = scheme();
    d.innerHTML = `<h2>Giao diện</h2><p class="muted">Mẫu giấy luôn giữ nền trắng để dễ đọc và in.</p><div class="scheme-options">${[
      ["light", "Sáng", "light"],
      ["dark", "Tối", "dark"],
    ]
      .map(
        ([v, t, ic]) =>
          `<button type="button" data-scheme="${v}" aria-pressed="${cur === v}">${icon(ic)}<span>${t}</span>${cur === v ? icon("check", "tick") : ""}</button>`,
      )
      .join(
        "",
      )}</div><div class="dialog-actions"><button type="button" class="text-btn" data-close>Xong</button></div>`;
    d.onclick = (e) => {
      const b = e.target.closest("button");
      if (e.target === d || b?.hasAttribute("data-close")) return d.close();
      if (b?.dataset.scheme) {
        try {
          localStorage.setItem(SCHEME_KEY, b.dataset.scheme);
        } catch {}
        applyScheme();
        openThemes();
        if (page === "settings" && !selected) render();
      }
    };
    if (!d.open) d.showModal();
  };

  // ---------- Thanh điều hướng & thanh nhập ----------
  let input = null,
    paperWidth = 0,
    frame = 0,
    pinch = null,
    fitMode = "content", // "content" | "page" | null (người dùng tự zoom)
    bounds = { left: 0, right: 1 },
    beforeTyping = null;
  const boundsCache = new Map();

  const bar = document.createElement("div");
  bar.id = "mobile-entry-nav";
  bar.hidden = true;
  bar.innerHTML = `<span class="mobile-field-label"></span><div class="mobile-entry-buttons"><button type="button" data-key="Previous" aria-label="Ô trước">${icon("prev")}</button><button type="button" data-key="Enter">Tiếp <kbd>↵</kbd></button><button type="button" data-key="Tab">Đổi cột <kbd>⇥</kbd></button>${[0, 2, 3, 5, 10].map((n) => `<button type="button" class="time-chip" data-add="${n}" aria-label="Mốc cộng ${n} phút">+${n}</button>`).join("")}<button type="button" data-key="Close" aria-label="Ẩn bàn phím">${icon("kbHide")}</button></div>`;
  document.body.appendChild(bar);

  const nav = document.createElement("nav");
  nav.id = "mobile-main-nav";
  nav.setAttribute("aria-label", "Điều hướng chính");
  nav.innerHTML = [
    ["home", "Trang chủ", "home"],
    ["myflight", "Chuyến bay", "flight"],
    ["settings", "Cài đặt", "settings"],
  ]
    .map(
      ([p, t, ic]) =>
        `<button data-page="${p}"><span class="pill">${icon(ic)}</span>${t}</button>`,
    )
    .join("");
  document.body.appendChild(nav);
  nav.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) go(b.dataset.page);
  });

  // Mở một chuyến bay (mới hoặc cũ) → mặc định hiện mẫu FSAGS 42.3.
  const DEFAULT_TEMPLATE = "fsags42.3",
    BBBT = "bbbt";
  let lastNonBbbt = null;
  let lastSelected; // undefined = lần render đầu (giữ mẫu khôi phục sau khi mở lại app)
  const oldRender = render;
  render = function () {
    if (lastSelected !== undefined && selected && selected !== lastSelected) {
      if (templateList().some((t) => t.id === DEFAULT_TEMPLATE)) {
        templateId = DEFAULT_TEMPLATE;
        formPage = 0;
      }
    }
    lastSelected = selected || null;
    input = null;
    bar.hidden = true;
    document.body.classList.remove("mobile-typing", "mobile-form-open");
    const content = $("content");
    if (content) content.style.height = "";
    lastMobileH = -1;
    oldRender();
    document.body.classList.toggle("mobile-detail", !!selected);
    nav
      .querySelectorAll("button")
      .forEach((b) => b.classList.toggle("active", b.dataset.page === page));
    const ph = document.querySelector("#content > .pagehead");
    if (ph && !selected) ph.classList.add("m3-large-title");
    const tb = document.querySelector('#content [data-nav="themes"]');
    if (tb) {
      tb.innerHTML = `${icon(scheme() === "dark" ? "dark" : "light")}<span>Giao diện: ${scheme() === "dark" ? "Tối" : "Sáng"}</span>`;
      tb.classList.add("scheme-btn");
    }
  };

  // App bar gọn cho trang chi tiết: ← | số hiệu + ngày | sửa | tab dạng icon
  const TAB_ICON = { info: "info", forms: "form", files: "attach" };
  const TAB_SHORT = { info: "Thông tin", forms: "Biểu mẫu", files: "Tài liệu" };
  function compactDetailHeader() {
    const ph = document.querySelector("#content > .pagehead");
    if (!ph || ph.dataset.m3) return;
    ph.dataset.m3 = "1";
    ph.classList.add("m3-appbar");
    const back = $("back"),
      edit = $("editFlight"),
      tabs = document.querySelector("#content > .tabs");
    if (back) {
      // Nút đầu thanh = Trang chủ (vuốt/nút Back của Android vẫn về danh sách).
      back.innerHTML = icon("home");
      back.setAttribute("aria-label", "Về trang chủ");
      back.title = "Trang chủ";
      back.classList.add("icon-btn", "home-btn");
      back.onclick = () => go("home");
      ph.prepend(back);
    }
    if (edit) {
      edit.innerHTML = icon("edit");
      edit.setAttribute("aria-label", "Sửa thông tin chuyến");
      edit.classList.add("icon-btn");
    }
    if (tabs) {
      tabs.classList.add("m3-segmented");
      tabs.querySelectorAll("button").forEach((b) => {
        const k = b.dataset.tab;
        b.setAttribute("aria-label", TAB_SHORT[k] || b.textContent);
        b.innerHTML = `${icon(TAB_ICON[k] || "info")}<span>${TAB_SHORT[k] || b.textContent}</span>`;
      });
      ph.appendChild(tabs);
    }
    if (edit) ph.appendChild(edit);
  }

  const oldDetail = renderDetail;
  renderDetail = function () {
    document.body.classList.toggle("mobile-form-open", tabName === "forms");
    document.body.classList.add("mobile-detail");
    document.body.classList.remove("mobile-typing");
    bar.hidden = true;
    input = null;
    oldDetail();
    compactDetailHeader();
    layout();
  };

  table = function (rows) {
    return rows.length
      ? '<div class="flight-cards">' +
          rows
            .map(
              (x) =>
                `<button class="flight-card" data-open="${escape(x.id)}"><span class="flight-badge">${icon("flight")}</span><span class="flight-main"><strong>${escape(x.flight)}</strong><span class="flight-route">${escape(x.route || "Chưa nhập đường bay")}</span><small>${escape(x.date)} · ${escape(x.reg || "Chưa nhập đăng ký tàu")}</small></span>${icon("chevron", "flight-arrow")}</button>`,
            )
            .join("") +
          "</div>"
      : empty("Chưa có chuyến bay. Bấm “Tạo chuyến bay” để bắt đầu.");
  };

  renderHome = function () {
    const recent = [...flights]
      .sort((a, b) =>
        (b.updatedAt || b.date).localeCompare(a.updatedAt || a.date),
      )
      .slice(0, 6);
    const todayCount = flights.filter((x) => x.date === today()).length;
    $("content").innerHTML =
      `<section class="mobile-welcome"><small>CXR · FLIGHT REPORT</small><h1>Sẵn sàng cho chuyến bay tiếp theo</h1><div class="welcome-stats"><span><b>${todayCount}</b> chuyến hôm nay</span><span><b>${flights.length}</b> hồ sơ</span></div></section><div class="mobile-section-title"><h2>Hồ sơ gần đây</h2><button id="allFlights" class="text-btn">Xem tất cả</button></div>${table(recent)}<p class="offline-pill"><span class="dot"></span>Offline · 0.23 · Dữ liệu lưu trên điện thoại này</p><button id="createFlight" class="m3-fab">${icon("add")}<span>Tạo chuyến bay</span></button>`;
    $("createFlight").onclick = () => openEditor();
    $("allFlights").onclick = () => {
      go("myflight");
      dayFilter = "";
      $("filterDate").value = "";
      updateResults();
    };
    bindOpen();
  };

  // ---------- Ô nhiều dòng theo dòng chấm ----------
  // Vị trí dòng chấm dò từ ảnh mẫu (tools/find_lines.py, đã kiểm tra bằng mắt): y/h vùng nhập,
  // baseline dòng đầu, lineStep khoảng cách dòng (% chiều cao trang), lines = số dòng chấm.
  const LINE_FIX = {"bbbt": {"bbbtDetail": {"y": 56.0684, "h": 11.339, "baseline": 57.3789, "lineStep": 1.5954, "lines": 7}}};
  for (const [tpl, fields] of Object.entries(LINE_FIX))
    for (const [id, v] of Object.entries(fields)) {
      const f = (CXR_FORM_LAYOUTS[tpl] || []).find((x) => x.id === id);
      if (f) Object.assign(f, { y: v.y, h: v.h, baseline: v.baseline, lineStep: v.lineStep, lines: v.lines });
    }
  // Số dòng tối đa của ô nhiều dòng có lineStep (khớp cách renderWritingText tính).
  function fieldLineCapacity(f) {
    if (!f?.multiline || !f.lineStep) return 0;
    if (f.lines) return f.lines;
    const base = f.baseline !== undefined ? f.baseline - f.y : f.h * 0.72;
    return Math.max(1, Math.floor((f.h - base) / f.lineStep) + 1);
  }
  // Bấm Tiếp/Enter trong ô nhiều dòng: xuống dòng chấm kế tiếp; hết dòng mới sang ô sau.
  document.addEventListener(
    "keydown",
    (e) => {
      const t = e.target;
      if (e.key !== "Enter" || e.shiftKey || e.isComposing || !t?.matches?.("textarea.paper-input")) return;
      const id = t.closest("[data-field]")?.dataset.field,
        f = formFields().find((x) => x.id === id),
        cap = fieldLineCapacity(f);
      if (!cap) return;
      const s0 = t.selectionStart ?? t.value.length,
        s1 = t.selectionEnd ?? s0;
      const after = t.value.slice(0, s0) + "\n" + t.value.slice(s1);
      if (after.split("\n").length > cap) return; // hết dòng → để app chuyển sang ô tiếp theo
      e.preventDefault();
      e.stopImmediatePropagation();
      t.setRangeText("\n", s0, s1, "end");
      t.dispatchEvent(new Event("input", { bubbles: true }));
    },
    true,
  );

  // ---------- Hộp tạo/sửa chuyến: Chuyến đến / Chuyến đi + nút cố định ----------
  // Số hiệu lưu dạng "ĐẾN/ĐI" (vd VJ123/VJ124) giống ô FLT No trên mẫu.
  const splitFlight = (v) => {
    const [a = "", d = ""] = String(v || "").split("/");
    return [a.trim(), d.trim()];
  };
  // Tên ô như trên form FSAGS; DATE lên đầu. (Sửa trực tiếp mảng flightKeys của app.js:
  // dùng chung cho hộp tạo/sửa, tab Thông tin và lúc lưu → khóa dữ liệu giữ nguyên.)
  (() => {
    const label = { date: "DATE", flight: "FLT No", route: "ROUTE", reg: "REGN", acType: "AC TYPE", stand: "BAY" };
    const order = ["date", "flight", "route", "acType", "reg", "stand"];
    const ai = flightKeys.findIndex((r) => r[0] === "airline"); // bỏ ô AIRLINE, thay bằng AC TYPE
    if (ai >= 0) flightKeys.splice(ai, 1, ["acType", "AC TYPE", "text"]);
    const label2 = { pax: "ARR PAX TTL", bags: "Y BAG", cargo: "ARR CARGO" };
    if (!flightKeys.some((r) => r[0] === "cbag")) {
      const bi = flightKeys.findIndex((r) => r[0] === "bags");
      flightKeys.splice(bi + 1, 0, ["cbag", "C BAG", "number"]); // Priority Bag
    }
    Object.keys(label2).forEach((k) => { const r = flightKeys.find((x) => x[0] === k); if (r) r[1] = label2[k]; });
    const rows = flightKeys.map((r) => (label[r[0]] ? [r[0], label[r[0]], ...r.slice(2)] : r));
    rows.sort((a, b) => {
      const ia = order.indexOf(a[0]), ib = order.indexOf(b[0]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    flightKeys.splice(0, flightKeys.length, ...rows);
  })();
  const oldEditor = openEditor;
  openEditor = function (f) {
    oldEditor(f);
    const form = $("flightForm"),
      orig = form?.elements.flight;
    if (!form || !orig || !$("flightDialog").open) return;
    const [arr, dep] = splitFlight(orig.value);
    const label = orig.closest("label");
    orig.type = "hidden";
    orig.required = false;
    const wrap = document.createElement("div");
    wrap.className = "flight-pair";
    wrap.innerHTML = `<span class="flight-pair-title">FLT No * <small>ARR / DEP</small></span><div class="flight-pair-row"><input name="flightArr" placeholder="ARR" autocapitalize="characters" autocomplete="off" aria-label="FLT No chuyến đến (ARR)"><span class="flight-slash">/</span><input name="flightDep" placeholder="DEP" autocapitalize="characters" autocomplete="off" aria-label="FLT No chuyến đi (DEP)"></div>`;
    label.replaceWith(wrap);
    wrap.appendChild(orig);
    const a = wrap.querySelector('[name="flightArr"]'),
      d = wrap.querySelector('[name="flightDep"]');
    a.value = arr;
    d.value = dep;
    const sync = () => {
      const x = a.value.trim().toUpperCase(),
        y = d.value.trim().toUpperCase();
      orig.value = x && y ? `${x}/${y}` : x || (y ? `/${y}` : "");
      a.setCustomValidity(orig.value ? "" : "Nhập FLT No chuyến đến (ARR) hoặc chuyến đi (DEP)");
    };
    a.oninput = d.oninput = sync;
    sync();
    // Thanh nút cố định ở đáy hộp (thay nút "Lưu hồ sơ" phải kéo xuống cuối)
    form.querySelector(":scope > button.primary")?.classList.add("legacy-submit");
    if (!form.querySelector(".dialog-footer")) {
      const foot = document.createElement("div");
      foot.className = "dialog-footer";
      foot.innerHTML = `<button type="button" class="footer-cancel">HỦY</button><button type="submit" class="primary footer-save">LƯU CHUYẾN</button>`;
      foot.querySelector(".footer-cancel").onclick = () => $("flightDialog").close();
      form.appendChild(foot);
    }
    // ROUTE chia 3 ô như trên form: [trước] / [CXR] / [sau]; mỗi ô tối đa 3 chữ cái, đủ 3 chữ tự nhảy ô sau.
    const rOrig = form.elements.route;
    if (rOrig && !form.querySelector(".route-trio")) {
      const parts = String(rOrig.value || "").split(/\s*(?:→|–|—|-|\/)\s*/);
      const rLabel = rOrig.closest("label");
      rOrig.type = "hidden";
      const trio = document.createElement("div");
      trio.className = "route-trio";
      trio.innerHTML = `<span class="flight-pair-title">ROUTE</span><div class="route-row">${[0, 1, 2]
        .map((i) =>
          i === 1
            ? // CXR là sân bay mặc định → ô giữa cố định, không nhận chạm/nhập, bỏ qua khi nhảy ô
              `<span class="flight-slash">/</span><input data-route="1" class="route-fixed" value="CXR" readonly tabindex="-1" aria-label="ROUTE: CXR (cố định)">`
            : `${i ? '<span class="flight-slash">/</span>' : ""}<input data-route="${i}" maxlength="3" inputmode="text" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="${["ĐI TỪ", "", "ĐẾN"][i]}" aria-label="ROUTE ${i ? "đến" : "đi từ"}">`,
        )
        .join("")}</div>`;
      rLabel.replaceWith(trio);
      trio.appendChild(rOrig);
      const all = [...trio.querySelectorAll("[data-route]")],
        boxes = all.filter((b) => !b.readOnly); // [đi từ, đến] — chỉ 2 ô nhập
      // Hồ sơ cũ dạng "SGN-CXR-HAN" → lấy phần 1 và 3; dạng 2 phần "SGN-HAN" → coi là đi từ / đến.
      const p = parts.filter((x, i) => !(parts.length === 3 && i === 1));
      boxes[0].value = (p[0] || "").toUpperCase().slice(0, 3);
      boxes[1].value = (p[1] || "").toUpperCase().slice(0, 3);
      const syncRoute = () => {
        const [x, y] = boxes.map((b) => b.value);
        rOrig.value = x || y ? `${x}-CXR-${y}`.replace(/-+$/, "") : "";
      };
      boxes.forEach((b, i) => {
        b.addEventListener("input", () => {
          const v = b.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
          if (v !== b.value) b.value = v;
          syncRoute();
          if (v.length === 3 && boxes[i + 1]) {
            boxes[i + 1].focus();
            boxes[i + 1].select();
          }
        });
        b.addEventListener("keydown", (e) => {
          if (e.key === "Backspace" && !b.value && boxes[i - 1]) {
            e.preventDefault();
            boxes[i - 1].focus();
          }
        });
        b.addEventListener("focus", () => b.select());
      });
      syncRoute();
    }
    // Phím Tiếp/Enter trên bàn phím: sang ô kế tiếp, KHÔNG lưu. Chỉ nút LƯU CHUYẾN mới lưu.
    const order = () =>
      [...form.querySelectorAll("input, select, textarea")].filter(
        (el) => el.type !== "hidden" && !el.readOnly && !el.disabled && el.offsetParent !== null && !el.closest(".dialog-footer"),
      );
    const ordered = order();
    ordered.forEach((el, i) => {
      if (el.tagName === "INPUT") el.setAttribute("enterkeyhint", i === ordered.length - 1 ? "done" : "next");
    });
    if (!form.dataset.enterNav) {
      form.dataset.enterNav = "1";
      form.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || e.isComposing || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
        e.preventDefault(); // chặn trình duyệt tự gửi form khi bấm Enter
        const list = order(),
          i = list.indexOf(e.target),
          next = list[i + 1];
        if (next) {
          next.focus();
          next.select?.();
        } else e.target.blur();
      });
    }
    // Bàn phím hiện lên: thu hộp thoại vào vùng nhìn thấy và cuộn ô đang nhập ra giữa, không bị phím che.
    const dlg = form.closest("dialog");
    if (dlg && !dlg.dataset.kbFit) {
      dlg.dataset.kbFit = "1";
      const vv = window.visualViewport;
      const fit = () => {
        if (!dlg.open) return;
        const h = vv ? vv.height : window.innerHeight;
        const kb = vv && window.innerHeight - h > 120; // bàn phím đang mở
        if (kb) {
          dlg.style.maxHeight = Math.max(200, h - 16) + "px";
          dlg.style.top = (vv.offsetTop || 0) + 8 + "px";
          dlg.style.bottom = "auto";
          dlg.style.marginTop = "0";
        } else {
          ["maxHeight", "top", "bottom", "marginTop"].forEach((k) => (dlg.style[k] = ""));
        }
        reveal();
      };
      const reveal = () => {
        const el = document.activeElement;
        if (!el || !dlg.contains(el) || el.closest(".dialog-footer")) return;
        const foot = dlg.querySelector(".dialog-footer");
        const box = dlg.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const top = box.top + 40; // chừa tiêu đề
        const bottom = (foot ? foot.getBoundingClientRect().top : box.bottom) - 8;
        const mid = (top + bottom) / 2;
        dlg.scrollTop += r.top + r.height / 2 - mid; // đưa ô vào giữa vùng nhìn thấy
      };
      dlg.addEventListener("focusin", () => {
        reveal();
        setTimeout(fit, 250); // đợi bàn phím trượt lên xong
        setTimeout(fit, 600);
      });
      vv?.addEventListener("resize", fit);
      vv?.addEventListener("scroll", fit);
      dlg.addEventListener("close", () => ["maxHeight", "top", "bottom", "marginTop"].forEach((k) => (dlg.style[k] = "")));
    }
    if (!f) setTimeout(() => a.focus(), 50);
  };
  // Ô FLT No trên mẫu: phần trước "/" = chuyến đến, phần sau = chuyến đi.
  const oldInitial = initialFormValue;
  // Ô đầu form (AC TYPE, REGN...) đã lưu rỗng từ trước khi chuyến có dữ liệu → vẫn lấy từ chuyến.
  const SYNC_KEYS = /^(?:f421_|f551_|f09_|f208_)?(acType|regn|arrPaxTTL|yBag|priorityBag|arrCargo|arrYBag|arrFCBag|bbbtRegn|bbbtAcType|bbbtFlight|bbbtRoute|bbbtDateText)$/;
  const oldFormValue = formValue;
  formValue = function (f, field) {
    const v = oldFormValue(f, field);
    if ((v === "" || v == null) && SYNC_KEYS.test(field.id)) return initialFormValue(f, field);
    return v;
  };
  initialFormValue = function (f, field) {
    const k = field.id.replace(/^(f421_|f551_|f09_|f208_)/, "");
    if (k === "fltBefore") return splitFlight(f.flight)[0];
    if (k === "fltAfter") return splitFlight(f.flight)[1];
    if (k === "bayBefore" || k === "bay") return f.stand || ""; // BAY trong hộp tạo chuyến → ô BAY trên mẫu
    if (k === "arrPaxTTL") return f.pax || ""; // ARR PAX TTL
    if (k === "yBag" || k === "arrYBag") return f.bags || ""; // Y BAG
    if (k === "priorityBag" || k === "arrFCBag") return f.cbag || ""; // Priority (C) BAG
    if (k === "arrCargo") return f.cargo || ""; // ARR CARGO
    if (k === "bbbtRegn") return f.reg || ""; // A/C Regn. của BBBT (bản gốc tìm nhầm id bbbtACReg)
    if (k === "bbbtAcType") return f.acType || ""; // AC TYPE của BBBT đồng bộ từ hộp tạo chuyến
    if (k === "bbbtFlight") return f.flight || ""; // ô "Flight No." của BBBT (bản gốc tìm nhầm id bbbtFlightNo)
    return oldInitial(f, field);
  };

  // ---------- Biểu mẫu: canh vừa ngang theo nội dung ----------
  const oldForms = renderForms;
  renderForms = function (f) {
    oldForms(f);
    setupCompleteButton();
    prewarmPdf();
    pdfCache = null;
    schedulePrerender(2500);
    document.body.classList.add("mobile-form-open");
    document.body.classList.remove("mobile-typing");
    input = null;
    bar.hidden = true;
    beforeTyping = null;
    const tools = $("templateSelect").parentElement;
    const zoom = document.createElement("div");
    zoom.className = "mobile-zoom";
    zoom.innerHTML = `<button type="button" data-zoom="out" aria-label="Thu nhỏ">${icon("remove")}</button><button type="button" data-zoom="fit" class="fit-toggle"></button><button type="button" data-zoom="in" aria-label="Phóng to">${icon("add")}</button>`;
    tools.appendChild(zoom);
    // Nút Trang chủ ở đầu hàng chọn mẫu — chỉ hiện khi đang nhập (lúc đó thanh tiêu đề ẩn).
    const home = document.createElement("button");
    home.type = "button";
    home.className = "icon-btn home-btn tools-home";
    home.setAttribute("aria-label", "Về trang chủ");
    home.title = "Trang chủ";
    home.innerHTML = icon("home");
    home.addEventListener("pointerdown", (e) => e.preventDefault());
    home.onclick = () => {
      input?.blur(); // ô đang nhập tự lưu khi rời ô
      setTimeout(() => go("home"), 150);
    };
    tools.prepend(home);
    // Nút cố định BBBT cạnh ô chọn mẫu: bấm → BBBT, bấm lại → về mẫu trước đó.
    const sel = $("templateSelect");
    if (sel && templateList().some((t) => t.id === BBBT)) {
      if (templateId !== BBBT) lastNonBbbt = templateId;
      const bb = document.createElement("button");
      bb.type = "button";
      bb.className = "bbbt-btn" + (templateId === BBBT ? " active" : "");
      bb.textContent = "BBBT";
      bb.setAttribute("aria-pressed", String(templateId === BBBT));
      bb.setAttribute("aria-label", templateId === BBBT ? "Quay lại mẫu trước" : "Mở biên bản bất thường BBBT");
      bb.addEventListener("pointerdown", (e) => e.preventDefault());
      bb.onclick = () => {
        input?.blur();
        const next = templateId === BBBT ? lastNonBbbt || DEFAULT_TEMPLATE : BBBT;
        if (!templateList().some((t) => t.id === next)) return;
        if (![...sel.options].some((o) => o.value === next)) sel.add(new Option(next, next));
        sel.value = next;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      };
      sel.after(bb);
    }
    // Ô chọn mẫu: luôn ghi gọn (vd "42.3") để APK và web hiển thị như nhau trên mọi máy.
    // BBBT đã có nút riêng → bỏ khỏi ô chọn; khi đang mở BBBT, ô chọn vẫn hiện mẫu đang dùng trước đó.
    if (sel) {
      sel.querySelectorAll("option").forEach((o) => {
        o.textContent = o.textContent.replace(/^FSAGS\s*/i, "");
        if (o.value === BBBT && sel.options.length > 1) o.remove();
      });
      if (templateId === BBBT) {
        const back = lastNonBbbt && templateList().some((t) => t.id === lastNonBbbt) ? lastNonBbbt : DEFAULT_TEMPLATE;
        sel.value = back;
        sel.classList.add("on-bbbt");
      }
      // Chia ô chọn làm 2 vùng: bấm CHỮ (vd "42.3") → về thẳng mẫu đó; bấm MŨI TÊN ⌄ → mở danh sách đổi mẫu.
      const pick = document.createElement("div");
      pick.className = "tpl-picker";
      sel.before(pick);
      pick.appendChild(sel);
      const go = document.createElement("button");
      go.type = "button";
      go.className = "tpl-go";
      go.setAttribute("aria-label", "Về mẫu " + (sel.options[sel.selectedIndex]?.text || ""));
      go.addEventListener("pointerdown", (e) => e.preventDefault());
      go.onclick = () => {
        input?.blur();
        if (sel.value && sel.value !== templateId) sel.dispatchEvent(new Event("change", { bubbles: true }));
      };
      pick.appendChild(go);
    }
    zoom.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") && input) e.preventDefault();
    });
    zoom.addEventListener("click", (e) => {
      const action = e.target.closest("button")?.dataset.zoom;
      if (!action) return;
      if (action === "fit") {
        input?.blur();
        applyFit(fitMode === "content" ? "page" : "content");
      } else {
        fitMode = null;
        if (beforeTyping) beforeTyping.manual = true;
        setWidth(
          G.clamp(
            paperWidth * (action === "in" ? 1.3 : 1 / 1.3),
            pageWidth(),
            1800,
          ),
        );
        updateFitButton();
        if (input) centerInput();
      }
    });
    const canvas = $("canvas");
    canvas.addEventListener("touchstart", pinchStart, { passive: true });
    // passive: Chrome điện thoại cuộn ngay, không chờ JS (CSS touch-action đã chặn zoom trang).
    canvas.addEventListener("touchmove", pinchMove, { passive: true });
    canvas.addEventListener("touchend", () => (pinch = null), {
      passive: true,
    });
    canvas.addEventListener("dblclick", (e) => {
      if (e.target.closest(".paper-input")) return;
      applyFit(fitMode === "content" ? "page" : "content");
    });
    document
      .querySelectorAll(".paper-input")
      .forEach((el) => el.setAttribute("enterkeyhint", "next"));
    // Áp dụng ngay theo cache (không nháy), sau đó đo ảnh thật.
    const key = templateKey();
    bounds = boundsCache.get(key) || G.unionBounds([], formFields());
    applyFit(fitMode || "content");
    measureBounds(key);
    layout();
  };

  // Nút "Hoàn tất" (thay "Lưu nháp"; dữ liệu vẫn tự lưu khi nhập).
  function isCompleted() {
    return !!active()?.completedForms?.[templateId];
  }
  function refreshCompleteButton() {
    const b = $("saveValues");
    if (!b) return;
    const done = isCompleted();
    b.classList.toggle("is-done", done);
    b.innerHTML = done
      ? `${icon("check")}<span>Đã hoàn tất</span>`
      : `${icon("check")}<span>Hoàn tất</span>`;
    b.setAttribute("aria-label", done ? "Biểu mẫu đã hoàn tất" : "Hoàn tất biểu mẫu");
  }
  function setupCompleteButton() {
    const pf = $("printForm");
    if (pf) pf.innerHTML = `${icon("share")}<span>Xuất PDF</span>`;
    const b = $("saveValues");
    if (!b) return;
    b.onclick = async () => {
      document.activeElement?.blur?.();
      b.disabled = true;
      try {
        await completeCurrentForm();
      } catch (e) {
        notice(e.message || "Không hoàn tất được");
      } finally {
        b.disabled = !canEdit(active());
        refreshCompleteButton();
      }
    };
    refreshCompleteButton();
    // Sửa số liệu sau khi hoàn tất sẽ đưa mẫu về bản nháp → cập nhật nhãn nút.
    const st = $("formSaveState");
    if (st) new MutationObserver(refreshCompleteButton).observe(st, { childList: true, characterData: true, subtree: true, attributes: true });
  }

  // ---------- Xuất PDF nhanh hơn ----------
  // 1.5x ≈ 225 DPI trên A4 (đủ nét khi in), JPEG 92%: ~1/2 dung lượng, vẽ + nén nhanh hơn ~2x.
  window.CXR_PDF_SCALE = 1.5;
  window.CXR_PDF_QUALITY = 0.92;
  // Tạo sẵn PDF ở nền khi người dùng ngừng nhập → bấm Xuất là chia sẻ ngay.
  // Khóa cache = mẫu + giá trị hiển thị của mọi ô (kể cả giá trị mặc định) + số hiệu/ngày.
  let pdfCache = null, // { key, blob, name }
    pdfJob = null, // { key, promise }
    prerenderTimer = 0;
  function pdfKey(f) {
    try {
      return (
        templateId + "|" + f.flight + "|" + f.date + "|" +
        JSON.stringify(formFields(templateId).map((x) => formValue(f, x) ?? ""))
      );
    } catch {
      return null;
    }
  }
  function buildPdf(f, key) {
    if (pdfJob && pdfJob.key === key) return pdfJob.promise;
    const flight = structuredClone(f),
      tpl = templateList().find((x) => x.id === templateId),
      fields = formFields(templateId);
    const promise = (async () => {
      await document.fonts.ready;
      const pages = await Promise.all(
        Array.from({ length: tpl.pages }, (_, i) => renderReportPage(flight, tpl, fields, i)),
      );
      const out = {
        key,
        blob: reportPdfBytes(pages),
        name: `${flight.flight || "CXR"}_${flight.date || ""}_${tpl.id}.pdf`.replace(/[\\/:*?"<>|]/g, "-"),
      };
      if (key) pdfCache = out;
      return out;
    })().finally(() => {
      if (pdfJob?.promise === promise) pdfJob = null;
    });
    pdfJob = { key, promise };
    return promise;
  }
  const whenIdle = (f) => (window.requestIdleCallback ? requestIdleCallback(f, { timeout: 4000 }) : setTimeout(f, 0));
  function schedulePrerender(delay = 2500) {
    clearTimeout(prerenderTimer);
    prerenderTimer = setTimeout(() => whenIdle(() => {
      if (!document.body.classList.contains("mobile-form-open") || input || document.hidden) return;
      const f = active();
      if (!f) return;
      // Còn số vừa gõ chưa ghi xong → đợi, tránh cache PDF thiếu số mới nhất.
      if ([...inlineDrafts.values()].some((x) => x.flightId === f.id)) return schedulePrerender(1000);
      const key = pdfKey(f);
      if (!key || pdfCache?.key === key || pdfJob?.key === key) return;
      buildPdf(f, key).catch(() => {});
    }), delay);
  }
  function shareBlob(blob, name) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const data = String(r.result).split(",")[1];
        window.CXRExportSheet(name, "application/pdf", data);
        resolve();
      };
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }
  exportCurrentReportPdf = async function () {
    const button = $("printForm");
    if (!button || button.disabled) return;
    button.disabled = true;
    const html = button.innerHTML;
    button.innerHTML = `<span class="spin"></span><span>Đang tạo PDF…</span>`;
    try {
      await flushInlineDrafts(); // lấy số vừa gõ
      const f = active(),
        key = pdfKey(f);
      // Lưu giá trị mặc định của mẫu ở nền (không ảnh hưởng nội dung PDF).
      if (canEdit(f)) persistFormDefaults().catch(() => {});
      const out = key && pdfCache?.key === key ? pdfCache : await buildPdf(f, key);
      await shareBlob(out.blob, out.name);
    } catch (error) {
      notice("XUẤT PDF THẤT BẠI: " + error.message);
    } finally {
      button.disabled = false;
      button.innerHTML = html;
    }
  };
  // Giải mã sẵn ảnh mẫu khi rảnh để lần xuất đầu không phải chờ.
  function prewarmPdf() {
    const run = () => {
      document.querySelectorAll(".paper img").forEach((img) => {
        const i = new Image();
        i.src = img.getAttribute("src");
        i.decode?.().catch(() => {});
      });
      document.fonts?.ready;
    };
    (window.requestIdleCallback || ((f) => setTimeout(f, 800)))(run);
  }

  // ---------- Xuất file: mở thẳng bảng chia sẻ của Android ----------
  // (Bảng chia sẻ đã có sẵn Drive / Files… nếu muốn lưu lại.)
  window.CXRExportSheet = function (name, mime, data) {
    const bridge = window.CXRAndroid;
    try {
      if (typeof bridge?.share === "function") bridge.share(name, mime, data);
      else bridge.save(name, mime, data); // APK cũ chưa có chia sẻ
    } catch (err) {
      notice("Không xuất được file: " + err.message);
    }
  };

  function templateKey() {
    return [...document.querySelectorAll(".paper img")]
      .map((i) => i.getAttribute("src"))
      .join("|");
  }
  function imageBounds(img) {
    try {
      const w = 320,
        h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const d = ctx.getImageData(0, 0, w, h).data;
      let left = w,
        right = -1;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          if (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11 < 200) {
            if (x < left) left = x;
            if (x > right) right = x;
          }
        }
      return right < 0 ? null : { left: left / w, right: (right + 1) / w };
    } catch {
      return null; // ảnh không đọc được pixel → giữ toàn trang
    }
  }
  function measureBounds(key) {
    const imgs = [...document.querySelectorAll(".paper img")];
    Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth
          ? Promise.resolve(img)
          : new Promise((r) => {
              img.addEventListener("load", () => r(img), { once: true });
              img.addEventListener("error", () => r(null), { once: true });
            }),
      ),
    ).then((loaded) => {
      if (key !== templateKey()) return;
      const b = G.unionBounds(
        loaded.map((img) => (img ? imageBounds(img) : { left: 0, right: 1 })),
        formFields(),
      );
      boundsCache.set(key, b);
      const changed =
        Math.abs(b.left - bounds.left) > 0.002 ||
        Math.abs(b.right - bounds.right) > 0.002;
      bounds = b;
      if (changed && fitMode && !input) applyFit(fitMode);
    });
  }
  function canvasWidth() {
    return $("canvas")?.clientWidth || innerWidth;
  }
  function pageWidth() {
    return Math.max(250, canvasWidth() - 2 * EDGE);
  }
  function applyFit(mode) {
    const canvas = $("canvas");
    if (!canvas) return;
    fitMode = mode;
    if (mode === "content") {
      const fit = G.contentFit(canvasWidth(), bounds.left, bounds.right, EDGE);
      setWidth(fit.width);
      canvas.scrollLeft = fit.scrollLeft;
    } else {
      setWidth(pageWidth());
      canvas.scrollLeft = 0;
    }
    updateFitButton();
  }
  function updateFitButton() {
    const b = document.querySelector(".fit-toggle");
    if (!b) return;
    const toPage = fitMode === "content";
    b.innerHTML = icon(toPage ? "fitP" : "fitW");
    b.title = toPage ? "Cả trang" : "Vừa ngang";
    b.setAttribute(
      "aria-label",
      toPage ? "Xem cả trang giấy" : "Phóng vừa bề ngang",
    );
  }
  function setWidth(width) {
    paperWidth = width;
    document
      .querySelectorAll(".paper")
      .forEach((p) => (p.style.width = width + "px"));
  }
  let lastMobileH = -1,
    layoutFrame = 0;
  function layout() {
    // Thanh địa chỉ Chrome ẩn/hiện bắn resize liên tục → gom về 1 lần mỗi khung hình.
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      doLayout();
    });
  }
  function doLayout() {
    const v = window.visualViewport,
      h = Math.round(v ? v.height : innerHeight);
    // Gán thẳng chiều cao cho #content (thuộc tính không kế thừa). KHÔNG dùng biến CSS ở :root:
    // đổi biến kế thừa buộc Chrome tính lại style cho toàn bộ hàng nghìn phần tử mỗi lần thanh địa chỉ ẩn/hiện.
    const content = $("content"),
      formOpen = document.body.classList.contains("mobile-form-open");
    if (content) {
      if (!formOpen) {
        if (content.style.height) content.style.height = "";
        lastMobileH = -1;
      } else if (h !== lastMobileH) {
        lastMobileH = h;
        content.style.height = h + "px";
      }
    }
    if (!bar.hidden) {
      bar.style.top =
        (v ? v.offsetTop + v.height : innerHeight) - bar.offsetHeight + "px";
      scheduleCenter();
    }
  }
  function centerInput() {
    if (!input?.isConnected || document.activeElement !== input) return;
    const canvas = $("canvas");
    if (!canvas) return;
    const rect = input.getBoundingClientRect(),
      box = canvas.getBoundingClientRect(),
      bottom = Math.min(box.bottom, bar.getBoundingClientRect().top - 12);
    const available = Math.max(40, bottom - box.top);
    canvas.scrollLeft = G.centeredScroll(
      canvas.scrollLeft,
      rect.left,
      rect.width,
      box.left,
      box.width,
    );
    canvas.scrollTop = G.centeredScroll(
      canvas.scrollTop,
      rect.top,
      rect.height,
      box.top,
      available,
    );
  }
  function scheduleCenter() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(centerInput);
  }

  // ---------- Gợi ý giờ +0 +2 +3 +5 +10 ----------
  // +N = giờ hiện tại của điện thoại cộng thêm N phút.
  const parseHM = (v) => {
    const m = /^(\d{1,2}):?(\d{2})$/.exec(String(v || "").trim());
    if (!m || +m[1] > 23 || +m[2] > 59) return null;
    return +m[1] * 60 + +m[2];
  };
  const fmtHM = (min) => {
    min = ((min % 1440) + 1440) % 1440;
    return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");
  };
  window.CXRTime = { parseHM, fmtHM };
  const nowMin = () => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  };
  let clockTimer = 0,
    baseLabel = "";
  function updateClockLabel() {
    const el = bar.querySelector(".mobile-field-label");
    if (!bar.classList.contains("time-mode") || bar.hidden) return;
    const now = nowMin();
    el.textContent = `${baseLabel} · Bây giờ ${fmtHM(now)}`;
    bar.querySelectorAll(".time-chip").forEach((c) => {
      c.innerHTML = `<b>+${c.dataset.add}</b><small>${fmtHM(now + +c.dataset.add)}</small>`;
    });
  }
  function startClock(on) {
    clearInterval(clockTimer);
    if (on) clockTimer = setInterval(updateClockLabel, 5000);
  }

  // ---------- Khung nhập ôm đúng ô kẻ đen trên mẫu ----------
  const canvasCache = new Map(),
    cellCache = new Map();
  // Vẽ ảnh mẫu vào canvas CPU (1 lần/ảnh); chỉ đọc pixel VÙNG NHỎ quanh ô cần dò
  // (Chrome điện thoại đọc cả trang 1241×1755 rất chậm).
  function paperCanvas(img) {
    const key = img.currentSrc || img.src;
    if (canvasCache.has(key)) return canvasCache.get(key);
    let ctx = null;
    try {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
    } catch {}
    canvasCache.set(key, ctx);
    return ctx;
  }
  function regionDark(img, x0, y0, x1, y1) {
    const ctx = paperCanvas(img);
    if (!ctx) return null;
    const W0 = img.naturalWidth,
      H0 = img.naturalHeight;
    x0 = Math.max(0, Math.floor(x0));
    y0 = Math.max(0, Math.floor(y0));
    x1 = Math.min(W0, Math.ceil(x1));
    y1 = Math.min(H0, Math.ceil(y1));
    const W = x1 - x0,
      H = y1 - y0;
    if (W < 4 || H < 4) return null;
    try {
      const d = ctx.getImageData(x0, y0, W, H).data,
        dark = new Uint8Array(W * H);
      for (let i = 0, j = 0; j < dark.length; i += 4, j++)
        dark[j] = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11 < 128 ? 1 : 0;
      return { dark, W, H, ox: x0, oy: y0, W0, H0 };
    } catch {
      return null;
    }
  }
  function fitCellFrame(inp) {
    const el = inp.closest(".inline-field"),
      paper = inp.closest(".paper"),
      img = paper?.querySelector("img");
    if (!el || !img?.naturalWidth) return;
    const key = templateKey() + "#" + el.dataset.field;
    let cell = cellCache.get(key);
    if (cell === undefined) {
      cell = null;
      const pr = paper.getBoundingClientRect(),
        fr = el.getBoundingClientRect(),
        NW = img.naturalWidth,
        NH = img.naturalHeight,
        sx = NW / pr.width,
        sy = NH / pr.height;
      // Vùng đọc pixel = đúng phạm vi findCell có thể dò tới (ngang ±(rộng ô+220), dọc ±max(3×cao,60)).
      const bx0 = (fr.left - pr.left) * sx,
        bx1 = (fr.right - pr.left) * sx,
        by0 = (fr.top - pr.top) * sy,
        by1 = (fr.bottom - pr.top) * sy,
        mh = bx1 - bx0 + 230,
        mv = Math.max(3 * (by1 - by0), 60) + 12;
      const region = regionDark(img, bx0 - mh, (by0 + by1) / 2 - mv, bx1 + mh, (by0 + by1) / 2 + mv);
      const map = region && { W: NW, H: NH };
      if (map) {
        const f = {
          x0: (fr.left - pr.left) / pr.width,
          y0: (fr.top - pr.top) / pr.height,
          w: fr.width / pr.width,
          h: fr.height / pr.height,
        };
        const rc = G.findCell(region.dark, region.W, region.H, {
          x0: bx0 - region.ox,
          x1: bx1 - region.ox,
          y0: by0 - region.oy,
          y1: by1 - region.oy,
        });
        const c = rc && {
          left: rc.left + region.ox,
          right: rc.right + region.ox,
          top: rc.top + region.oy,
          bottom: rc.bottom + region.oy,
        };
        // Ô kẻ chứa nhiều trường (ROUTE …/…/…, PAX TTL/C/Y/I, STA/ETA):
        // giữ cạnh trên/dưới theo đường kẻ, bề ngang chỉ ôm trường đang nhập.
        if (c) {
          const shared = [...paper.querySelectorAll(".inline-field")].some((o) => {
            if (o === el) return false;
            const r = o.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) return false;
            const ox = ((r.left + r.right) / 2 - pr.left) * sx,
              oy = ((r.top + r.bottom) / 2 - pr.top) * sy;
            return ox > c.left && ox < c.right && oy > c.top && oy < c.bottom;
          });
          if (shared) {
            c.left = (fr.left - pr.left) * sx;
            c.right = (fr.right - pr.left) * sx;
          }
        }
        if (c && f.w > 0 && f.h > 0)
          cell = {
            l: ((c.left / map.W - f.x0) / f.w) * 100,
            t: ((c.top / map.H - f.y0) / f.h) * 100,
            w: (((c.right - c.left) / map.W) / f.w) * 100,
            h: (((c.bottom - c.top) / map.H) / f.h) * 100,
          };
      }
      cellCache.set(key, cell);
    }
    el.classList.toggle("cell-fit", !!cell);
    if (cell)
      for (const k of ["l", "t", "w", "h"])
        el.style.setProperty("--cell-" + k, cell[k].toFixed(3) + "%");
  }

  document.addEventListener("focusin", (e) => {
    if (!e.target.matches(".paper-input")) return;
    if (!input && !beforeTyping)
      beforeTyping = { mode: fitMode, width: paperWidth, manual: false };
    input = e.target;
    bar.hidden = false;
    document.body.classList.add("mobile-typing");
    const field = formFields().find(
      (x) => x.id === input.closest("[data-field]").dataset.field,
    );
    bar.querySelector(".mobile-field-label").textContent =
      `Trang ${(field?.page || 0) + 1} · ${field?.label || input.getAttribute("aria-label")}`;
    fitCellFrame(input);
    const isTime = !!field && fieldNumericKind(field) === "time";
    bar.classList.toggle("time-mode", isTime);
    baseLabel = bar.querySelector(".mobile-field-label").textContent;
    updateClockLabel();
    startClock(isTime);
    if (paperWidth < READABLE_WIDTH) {
      setWidth(READABLE_WIDTH);
      fitMode = null;
      updateFitButton();
    }
    layout();
    scheduleCenter();
  });
  document.addEventListener("focusout", () =>
    setTimeout(() => {
      if (document.activeElement?.matches(".paper-input")) return;
      const last = input;
      input = null;
      bar.hidden = true;
      startClock(false);
      document.body.classList.remove("mobile-typing");
      layout();
      restoreAfterTyping(last);
      schedulePrerender();
    }, 0),
  );
  // Ẩn phím → trả về mức xem trước khi nhập (nếu người dùng không tự zoom),
  // giữ ô vừa nhập trong tầm nhìn.
  function restoreAfterTyping(last) {
    const prev = beforeTyping;
    beforeTyping = null;
    const canvas = $("canvas");
    if (!prev || prev.manual || !canvas || !last?.isConnected) return;
    requestAnimationFrame(() => {
      const r0 = last.getBoundingClientRect(),
        box = canvas.getBoundingClientRect();
      const ratio = paperWidth;
      if (prev.mode) applyFit(prev.mode);
      else setWidth(prev.width);
      const k = paperWidth / ratio;
      canvas.scrollTop = Math.max(
        0,
        (canvas.scrollTop + r0.top - box.top) * k - box.height / 3,
      );
    });
  }

  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) e.preventDefault();
  });
  bar.addEventListener("click", (e) => {
    const chip = e.target.closest("button[data-add]");
    if (chip && input) {
      input.value = fmtHM(nowMin() + +chip.dataset.add);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
      layout();
      return;
    }
    const key = e.target.closest("button")?.dataset.key;
    if (!key || !input) return;
    if (key === "Close") {
      input.blur();
      return;
    }
    if (key === "Previous") {
      const all = [...document.querySelectorAll(".paper-input")],
        i = all.indexOf(input);
      if (i > 0) {
        input.blur();
        all[i - 1].focus({ preventScroll: true });
      }
    } else
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
      );
    layout();
  });

  function pinchStart(e) {
    if (e.touches.length !== 2) return;
    const canvas = $("canvas"),
      r = canvas.getBoundingClientRect();
    pinch = {
      width: paperWidth,
      distance: Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      ),
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top,
      left: canvas.scrollLeft,
      top: canvas.scrollTop,
    };
  }
  function pinchMove(e) {
    if (!pinch || e.touches.length !== 2) return;
    const canvas = $("canvas"),
      d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      ),
      width = G.pinchWidth(pinch.width, d, pinch.distance, pageWidth()),
      ratio = width / pinch.width;
    fitMode = null;
    if (beforeTyping) beforeTyping.manual = true;
    setWidth(width);
    updateFitButton();
    canvas.scrollLeft = (pinch.left + pinch.x) * ratio - pinch.x;
    canvas.scrollTop = (pinch.top + pinch.y) * ratio - pinch.y;
  }

  // Xoay màn hình / đổi kích thước: canh lại nếu đang ở chế độ vừa khung.
  let lastCanvasW = 0;
  function onResize() {
    layout();
    const w = $("canvas")?.clientWidth;
    if (w && w !== lastCanvasW) {
      lastCanvasW = w;
      if (fitMode && !input && document.body.classList.contains("mobile-form-open"))
        applyFit(fitMode);
    }
  }
  window.visualViewport?.addEventListener("resize", onResize);
  window.visualViewport?.addEventListener("scroll", layout);
  window.addEventListener("resize", onResize);
  layout();
})();
