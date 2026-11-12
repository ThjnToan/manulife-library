/* Manulife Knowledge Hub · application shell */
(function () {
  "use strict";

  var LIB = window.LIBRARY;
  var TOOLS = window.TOOLS || [];
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* --------------------------------------------------------------- icons */

  var ICON_PATHS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
    library: '<path d="M4 4h5v16H4z"/><path d="M9 4h5v16H9z"/><path d="m14 5 4.5 14"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 18h2M12 18h2M16 18h.01"/>',
    path: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h6a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h7"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z"/>',
    source: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    print: '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 17h10v4H7z"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M20 14v6H4V4h6"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20a5 5 0 0 1 6-4.5"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="m7 15 4-5 3 3 5-7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    warn: '<path d="M12 3 2.5 20h19z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    tip: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.7 1 1.5 1 2.5h6c0-1 .4-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'
  };

  function icon(name, cls) {
    var body = ICON_PATHS[name] || ICON_PATHS.info;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }
  window.icon = icon;

  /* --------------------------------------------------------------- helpers */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }
  function catById(id) { return LIB.categories.filter(function (c) { return c.id === id; })[0] || LIB.categories[0]; }
  function articleById(id) { return LIB.articles.filter(function (a) { return a.id === id; })[0]; }
  function toolById(id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }
  function docById(id) { return (LIB.docs || []).filter(function (d) { return d.id === id; })[0]; }
  function pad(n) { return String(n).padStart(2, "0"); }

  var LS = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    }
  };

  function bookmarks() { return LS.get("mlib.bookmarks", []); }
  function isBookmarked(id) { return bookmarks().indexOf(id) >= 0; }
  function updateBadge() {
    var b = bookmarks().length, el = $("#bmBadge");
    if (!el) return;
    el.hidden = b === 0;
    el.textContent = b;
  }
  function toggleBookmark(id) {
    var arr = bookmarks(), i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1); else arr.unshift(id);
    LS.set("mlib.bookmarks", arr);
    updateBadge();
    toast(i >= 0 ? "Đã bỏ đánh dấu" : "Đã lưu bài viết");
    return i < 0;
  }
  function pushRecent(id) {
    var arr = LS.get("mlib.recent", []).filter(function (x) { return x !== id; });
    arr.unshift(id);
    LS.set("mlib.recent", arr.slice(0, 10));
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-on"); }, 2200);
  }

  var CLEANUPS = [];
  function onCleanup(fn) { CLEANUPS.push(fn); }
  function runCleanups() {
    CLEANUPS.forEach(function (f) { try { f(); } catch (e) {} });
    CLEANUPS = [];
  }

  /* --------------------------------------------------------------- routing */

  function parseRoute() {
    var h = location.hash.replace(/^#/, "") || "/";
    var qIndex = h.indexOf("?");
    var path = qIndex >= 0 ? h.slice(0, qIndex) : h;
    var qs = qIndex >= 0 ? h.slice(qIndex + 1) : "";
    return {
      path: path || "/",
      parts: path.split("/").filter(Boolean),
      params: new URLSearchParams(qs)
    };
  }

  var NAV_FOR = { "": "home", library: "library", article: "library", tools: "tools", glossary: "glossary", paths: "paths", sources: "sources", doc: "sources" };

  function setActiveNav(key) {
    $$(".navlink, .tabbar a").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === key);
    });
  }

  function setCrumbs(items) {
    var el = $("#crumbs");
    if (!el) return;
    el.innerHTML = items.map(function (it, i) {
      var sep = i ? '<span class="chev">/</span>' : "";
      if (it[1]) return sep + '<a href="' + it[1] + '">' + esc(it[0]) + "</a>";
      return sep + '<span class="crumb-now">' + esc(it[0]) + "</span>";
    }).join("");
  }

  function render() {
    runCleanups();
    var r = parseRoute();
    var p = r.parts;
    var main = $("#main");
    var nav = "home", crumbs = [["Trang chủ", "#/"]], title = "Thư viện tri thức Manulife";

    if (p.length === 0) {
      main.innerHTML = renderHome();
      afterHome();
    } else if (p[0] === "library") {
      nav = "library"; crumbs = [["Trang chủ", "#/"], ["Thư viện"]];
      title = "Thư viện · Manulife";
      main.innerHTML = renderLibrary(r.params);
      afterLibrary();
    } else if (p[0] === "article" && p[1]) {
      var a = articleById(p[1]);
      if (a) {
        nav = "library";
        var c = catById(a.cat);
        crumbs = [["Trang chủ", "#/"], [c.name, "#/library?cat=" + c.id], [a.title]];
        title = a.title + " · Manulife";
        main.innerHTML = renderArticle(a);
        afterArticle(a);
        pushRecent(a.id);
      } else {
        main.innerHTML = render404("Không tìm thấy bài viết");
      }
    } else if (p[0] === "tools" && p[1]) {
      var t = toolById(p[1]);
      if (t) {
        nav = "tools"; crumbs = [["Trang chủ", "#/"], ["Công cụ", "#/tools"], [t.title]];
        title = t.title + " · Manulife";
        main.innerHTML = renderToolPage(t);
        afterTool(t);
      } else {
        main.innerHTML = render404("Không tìm thấy công cụ");
      }
    } else if (p[0] === "tools") {
      nav = "tools"; crumbs = [["Trang chủ", "#/"], ["Công cụ"]];
      title = "Công cụ tính toán · Manulife";
      main.innerHTML = renderToolsIndex();
    } else if (p[0] === "glossary") {
      nav = "glossary"; crumbs = [["Trang chủ", "#/"], ["Tra cứu"]];
      title = "Tra cứu thuật ngữ · Manulife";
      main.innerHTML = renderGlossary(r.params);
      afterGlossary();
    } else if (p[0] === "paths") {
      nav = "paths"; crumbs = [["Trang chủ", "#/"], ["Lộ trình"]];
      title = "Lộ trình phát triển · Manulife";
      main.innerHTML = renderPaths(r.params);
      afterPaths(r.params);
    } else if (p[0] === "doc" && p[1]) {
      var d = docById(p[1]);
      if (d) {
        nav = "sources";
        crumbs = [["Trang chủ", "#/"], ["Nguồn tài liệu", "#/sources"], [d.short || d.title]];
        title = d.title + " · Manulife";
        main.innerHTML = renderDoc(d, r.params);
      } else {
        main.innerHTML = render404("Không tìm thấy tài liệu");
      }
    } else if (p[0] === "sources") {
      nav = "sources"; crumbs = [["Trang chủ", "#/"], ["Nguồn tài liệu"]];
      title = "Nguồn tài liệu · Manulife";
      main.innerHTML = renderSources();
    } else {
      main.innerHTML = render404("Không tìm thấy trang");
    }

    setActiveNav(nav);
    setCrumbs(crumbs);
    document.title = title;
    if (p[0] !== "article") $("#progress").hidden = true;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    closeRail();
  }

  /* --------------------------------------------------------------- cards */

  function articleCard(a, feature) {
    var c = catById(a.cat);
    return '<a class="card' + (feature ? " card--feature" : "") + '" href="#/article/' + a.id + '">' +
      '<div class="card__top"><span class="dot" style="background:' + c.color + '"></span><span class="card__cat">' + esc(c.name) + '</span><span class="card__num">' + pad(a.order) + '</span></div>' +
      '<h3>' + esc(a.title) + '</h3>' +
      '<p>' + esc(a.summary) + '</p>' +
      '<div class="card__meta">' + icon("clock") + '<span>' + a.read + ' phút</span><span class="sep"></span><span>' + esc(c.short) + '</span></div>' +
      '</a>';
  }

  function toolCard(t, wide) {
    return '<a class="card card--tool' + (wide ? " card--wide" : "") + '" href="#/tools/' + t.id + '">' +
      '<div class="tool-ico">' + icon(t.icon) + '</div>' +
      '<div class="card__cat">Công cụ</div>' +
      '<h3>' + esc(t.title) + '</h3>' +
      '<p>' + esc(t.desc) + '</p>' +
      '<div class="card__meta">' + icon("arrow") + '<span>Mở máy tính</span></div>' +
      '</a>';
  }

  function docCard(d) {
    return '<a class="doc-card" href="#/doc/' + d.id + '">' +
      '<span class="doc-card__ico">' + icon("source") + '</span>' +
      '<span class="doc-card__body">' +
        '<span class="doc-card__kind">' + esc(d.kind || "Tài liệu") + '</span>' +
        '<strong>' + esc(d.title) + '</strong>' +
        '<span>' + esc(d.desc) + '</span>' +
        '<span class="doc-card__meta">' + d.pages + ' trang · ' + esc(d.memo || "Nội bộ") + '</span>' +
      '</span>' +
      '<span class="doc-card__go">' + icon("arrow") + '</span></a>';
  }

  function renderDoc(d, params) {
    var page = parseInt(params && params.get("page"), 10);
    if (!(page >= 1 && page <= d.pages)) page = 1;
    var file = d.file;
    var note = d.encrypted ? '<p class="doc-note">' + icon("warn") + ' Tài liệu gốc được mã hóa bằng mật khẩu nội bộ. Khi trình duyệt hỏi mật khẩu, nhập mật khẩu đội ngũ. Nếu khung xem không hiện, bấm Mở PDF ở trên. Nếu chưa có mật khẩu, liên hệ Toàn.</p>' : "";
    return '<div class="page-head doc-head"><div>' +
      '<p class="overline">Tài liệu gốc · ' + esc(d.kind || "PDF") + '</p>' +
      '<h1 class="display">' + esc(d.title) + '</h1>' +
      '<p>' + esc(d.desc) + '</p>' +
      '<div class="doc-meta">' +
        '<span><b>' + d.pages + '</b> trang</span>' +
        (d.memo ? '<span>Memo <b>' + esc(d.memo) + '</b></span>' : "") +
        (d.effective ? '<span>Hiệu lực <b>' + esc(d.effective) + '</b></span>' : "") +
      '</div></div>' +
      '<div class="doc-actions">' +
        '<a class="btn btn--primary" href="' + esc(file) + '#page=' + page + '" target="_blank" rel="noopener">' + icon("external") + ' Mở PDF</a>' +
        '<a class="btn btn--ghost" href="' + esc(file) + '" download>' + icon("download") + ' Tải về</a>' +
      '</div></div>' +
      '<div class="doc-shell"><iframe src="' + esc(file) + '#page=' + page + '&amp;view=FitH" title="' + esc(d.title) + '" loading="lazy">' +
        '<p>Trình duyệt không hiển thị PDF trực tiếp. <a href="' + esc(file) + '" target="_blank" rel="noopener">Mở PDF trong tab mới</a>.</p>' +
      '</iframe></div>' +
      '<div class="doc-mobile">' + icon("source") + '<div><strong>' + esc(d.title) + '</strong><p>PDF ' + d.pages + ' trang · mở bằng trình xem PDF của điện thoại.</p></div>' +
        '<a class="btn btn--primary" href="' + esc(file) + '#page=' + page + '" target="_blank" rel="noopener">Mở PDF</a></div>' + note +
      '<div class="article-nav"><a class="article-nav__prev" href="#/sources">' + icon("arrowLeft") + '<span><small>Quay lại</small><strong>Nguồn tài liệu</strong></span></a>' +
      '<a class="article-nav__next" href="' + esc(file) + '#page=' + page + '" target="_blank" rel="noopener"><span><small>Nếu khung xem bị chặn</small><strong>Mở PDF trong tab mới</strong></span>' + icon("arrow") + '</a></div>';
  }

  function sectionHead(over, title, sub, link, linkText) {
    return '<div class="section__head"><div><p class="overline">' + over + '</p><h2 class="h2">' + title + '</h2>' +
      (sub ? '<p>' + sub + '</p>' : "") + '</div>' +
      (link ? '<a class="section__link" href="' + link + '">' + linkText + icon("arrow") + '</a>' : "") + '</div>';
  }

  /* --------------------------------------------------------------- home */

  function renderHome() {
    var counts = LIB.meta.counts;
    var featured = LIB.articles.filter(function (a) { return a.featured; }).slice(0, 4);
    if (featured.length < 4) {
      LIB.articles.forEach(function (a) { if (featured.length < 4 && featured.indexOf(a) < 0) featured.push(a); });
    }
    var recentIds = LS.get("mlib.recent", []).slice(0, 3).map(articleById).filter(Boolean);
    var spread = [];
    var seen = {};
    LIB.articles.forEach(function (a) {
      if (!seen[a.cat] && spread.length < 6) { seen[a.cat] = 1; spread.push(a); }
    });
    LIB.articles.forEach(function (a) { if (spread.length < 6 && spread.indexOf(a) < 0) spread.push(a); });
    var terms = ["FYP", "FYC", "P13 / TLDTHD", "Manulife Pro", "MBA Pro", "1mAA_4mFYC"].map(function (t) {
      return LIB.glossary.filter(function (g) { return g.term === t; })[0];
    }).filter(Boolean);

    return '<section class="hero">' +
      '<div class="hero__main">' +
        '<p class="overline">Manulife Business Academy · VP Đà Nẵng</p>' +
        '<h1 class="display">Tri thức chính sách,<br><em>trong tầm tay.</em></h1>' +
        '<p class="hero__lede">Toàn bộ chính sách thù lao, phí dịch vụ, chỉ số kinh doanh và công cụ tính toán, gom về một chỗ. Tra bằng tiếng Việt, mở trên điện thoại, dùng ngay trong buổi coaching.</p>' +
        '<form class="hero__search" id="heroSearch"><div class="searchfield">' + icon("search") +
          '<input id="heroInput" type="search" placeholder="Thử: thưởng quý, P13, phí hoạt động nhóm..." aria-label="Tìm trong thư viện">' +
        '</div><button class="btn btn--primary" type="submit">Tìm kiếm</button></form>' +
        '<div class="hero__chips">' +
          '<a class="chip" href="#/paths?p=fa-moi">Tôi là FA mới</a>' +
          '<a class="chip" href="#/paths?p=um">Tôi là quản lý</a>' +
          '<a class="chip" href="#/tools/fa-income">Tính thu nhập</a>' +
          '<a class="chip" href="#/sources">Tài liệu gốc</a>' +
          '<a class="chip" href="#/glossary">Tra thuật ngữ</a>' +
        '</div>' +
      '</div>' +
      '<aside class="edition-card">' +
        '<div class="edition-card__top"><span class="edition-card__label">Ấn bản chính sách</span>' + icon("layers", "edition-card__mark") + '</div>' +
        '<div><div class="edition-card__year">2026</div><div class="edition-card__sub">Hiệu lực từ 01/04/2026 cho chính sách đại lý và 01/01/2026 cho biểu phí quản lý.</div></div>' +
        '<div><div class="edition-card__stats">' +
          '<div class="edition-stat"><b>' + counts.articles + '</b><span>Bài viết</span></div>' +
          '<div class="edition-stat"><b>' + counts.categories + '</b><span>Chủ đề</span></div>' +
          '<div class="edition-stat"><b>' + TOOLS.length + '</b><span>Công cụ</span></div>' +
          '<div class="edition-stat"><b>' + counts.glossary + '</b><span>Thuật ngữ</span></div>' +
        '</div><div class="edition-card__foot">' + icon("check") + ' Đã đối chiếu deck MBA 04/2026 · ' + counts.docs + ' tài liệu gốc</div></div>' +
      '</aside>' +
    '</section>' +

    '<section class="section">' + sectionHead("Lộ trình", "Bắt đầu từ đâu", "Chọn đúng vai trò, đi theo thứ tự, mở đúng bài và đúng công cụ.", "#/paths", "Xem tất cả lộ trình") +
      '<div class="path-grid">' + LIB.paths.map(function (p) {
        return '<a class="path-card" style="--pc:' + p.color + '" href="#/paths?p=' + p.id + '">' +
          '<span class="path-card__sub">' + esc(p.sub) + '</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p>' +
          '<span class="path-card__arrow">' + icon("arrow") + '</span></a>';
      }).join("") + '</div>' +
    '</section>' +

    '<section class="section">' + sectionHead("Công cụ", "Tính trước khi tư vấn", "Nhập số liệu thật, xem khoản thưởng và khoảng thiếu ngay trên màn hình.", "#/tools", "Mở tất cả công cụ") +
      '<div class="grid grid--3">' + TOOLS.map(function (t, i) { return toolCard(t, i === 0); }).join("") + '</div>' +
    '</section>' +

    '<section class="section">' + sectionHead("Tài liệu gốc", "Mở đúng slide, đúng memo", "Sáu tài liệu PDF để đối chiếu khi cần trích dẫn, kiểm tra hoặc đào tạo lại.", "#/sources", "Xem kho tài liệu") +
      '<div class="doc-grid doc-grid--3">' + (LIB.docs || []).slice(0, 3).map(docCard).join("") + '</div>' +
    '</section>' +

    '<section class="section">' + sectionHead("Nổi bật", "Đọc trước, hiểu nhanh", "Bốn bài nền tảng cho hầu hết câu hỏi trong tháng.", "#/library", "Vào thư viện") +
      '<div class="grid grid--2">' + featured.map(function (a) { return articleCard(a, true); }).join("") + '</div>' +
    '</section>' +

    (recentIds.length ? '<section class="section">' + sectionHead("Cá nhân", "Tiếp tục đọc", "Ba bài bạn mở gần nhất trên thiết bị này.", null) +
      '<div class="grid grid--3">' + recentIds.map(function (a) { return articleCard(a); }).join("") + '</div></section>' : "") +

    '<section class="section">' + sectionHead("Điểm mới", "Mới cập nhật trong thư viện", "Các bài trải đều sáu chủ đề, cập nhật cùng ấn bản chính sách.", "#/library", "Xem tất cả") +
      '<div class="library-grid">' + spread.map(function (a) { return articleCard(a); }).join("") + '</div>' +
    '</section>' +

    '<section class="section">' + sectionHead("Tra cứu nhanh", "Thuật ngữ hay gặp", "Sáu định nghĩa mở khóa phần lớn bảng trong chính sách.", "#/glossary", "Tra toàn bộ thuật ngữ") +
      '<div class="gloss-grid">' + terms.map(function (g) {
        return '<div class="term"><div class="term__head"><h3>' + esc(g.term) + '</h3><span class="term__cat">' + esc(g.cat) + '</span></div><p>' + esc(g.def) + '</p>' +
          (g.article ? '<a href="#/article/' + g.article + '">Đọc bài liên quan' + icon("arrow") + '</a>' : "") + '</div>';
      }).join("") + '</div>' +
    '</section>' +

    '<section class="section"><div class="info-card" style="border-left:3px solid var(--brand)">' +
      '<p class="overline">Nguồn</p><h3 class="h3" style="margin:6px 0 6px">Tóm tắt từ bộ tài liệu MBA 04/2026</h3>' +
      '<p>Nội dung được biên soạn từ ba deck chính sách FA, UM, PSM+ và bộ phân tích hệ chỉ số. Mỗi bài đều ghi số memo và slide gốc. Khi áp dụng chính thức, đối chiếu lại văn bản chính sách mới nhất.</p>' +
      '<p style="margin-top:10px"><a href="#/sources">Xem bản đồ nguồn và cách cập nhật thư viện ' + icon("arrow") + '</a></p>' +
    '</div></section>';
  }

  function afterHome() {
    var f = $("#heroSearch");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = $("#heroInput").value.trim();
      location.hash = "#/library" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  }

  /* --------------------------------------------------------------- library */

  function renderLibrary(params) {
    var q = params.get("q") || "";
    var cat = params.get("cat") || "";
    var bm = params.get("bookmarks") === "1";
    var cats = '<button class="chip' + (!cat ? " is-active" : "") + '" data-cat="">Tất cả <span class="chip__count">' + LIB.articles.length + '</span></button>' +
      LIB.categories.map(function (c) {
        var n = LIB.articles.filter(function (a) { return a.cat === c.id; }).length;
        return '<button class="chip' + (cat === c.id ? " is-active" : "") + '" data-cat="' + c.id + '">' + esc(c.name) + ' <span class="chip__count">' + n + '</span></button>';
      }).join("") +
      '<button class="chip' + (bm ? " is-active" : "") + '" data-bm="1">' + icon("bookmark") + ' Đã lưu</button>';

    return '<div class="page-head"><div><p class="overline">Thư viện</p><h1 class="display">Toàn bộ tri thức</h1>' +
      '<p>' + LIB.meta.counts.articles + ' bài viết, chia theo sáu chủ đề. Tìm theo tên khoản thưởng, chỉ số hoặc chức danh.</p></div>' +
      '<div class="page-head__count"><b id="libCount">' + LIB.articles.length + '</b> bài đang hiển thị</div></div>' +
      '<div class="filters">' +
        '<div class="searchfield">' + icon("search") + '<input id="libSearch" type="search" value="' + esc(q) + '" placeholder="Tìm trong thư viện..." aria-label="Tìm trong thư viện"></div>' +
        '<span class="filter-label">Chủ đề</span>' + cats +
        '<span class="filters__spacer"></span>' +
        '<select id="libSort" aria-label="Sắp xếp" style="height:30px;border:1px solid var(--line);border-radius:15px;background:#fff;font-size:12px;padding:0 10px;color:var(--muted)">' +
          '<option value="cat">Theo chủ đề</option><option value="az">A đến Z</option><option value="new">Mới nhất</option>' +
        '</select>' +
      '</div>' +
      '<div class="library-grid" id="libGrid">' + LIB.articles.map(function (a) {
        var c = catById(a.cat);
        return '<a class="card" href="#/article/' + a.id + '" data-cat="' + a.cat + '" data-title="' + esc(norm(a.title)) + '" data-order="' + a.order + '" data-bm="' + (isBookmarked(a.id) ? "1" : "0") + '" data-search="' + esc(norm(a.title + " " + a.summary + " " + a.tags.join(" ") + " " + a.plain)) + '">' +
          '<div class="card__top"><span class="dot" style="background:' + c.color + '"></span><span class="card__cat">' + esc(c.name) + '</span><span class="card__num">' + pad(a.order) + '</span></div>' +
          '<h3>' + esc(a.title) + '</h3><p>' + esc(a.summary) + '</p>' +
          '<div class="card__meta">' + icon("clock") + '<span>' + a.read + ' phút</span><span class="sep"></span><span>' + esc(c.short) + '</span></div></a>';
      }).join("") + '</div>' +
      '<div class="empty" id="libEmpty" hidden><h3>Không có bài phù hợp</h3><p>Thử từ khóa khác, bỏ lọc chủ đề hoặc bỏ đánh dấu.</p></div>';
  }

  function applyLibFilter() {
    var input = $("#libSearch");
    var grid = $("#libGrid");
    if (!grid) return;
    var q = norm(input ? input.value : "");
    var activeCat = $("#libGrid").parentElement.querySelector(".filters .chip.is-active[data-cat]");
    var cat = activeCat ? activeCat.getAttribute("data-cat") : "";
    var bmChip = $(".filters .chip[data-bm].is-active");
    var bmOnly = !!bmChip;
    var cards = $$(".card", grid);
    var shown = 0;
    cards.forEach(function (card) {
      var ok = (!cat || card.getAttribute("data-cat") === cat) &&
        (!bmOnly || card.getAttribute("data-bm") === "1") &&
        (!q || card.getAttribute("data-search").indexOf(q) >= 0);
      card.hidden = !ok;
      if (ok) shown++;
    });
    var count = $("#libCount");
    if (count) count.textContent = shown;
    var empty = $("#libEmpty");
    if (empty) empty.hidden = shown !== 0;
  }

  function sortLib() {
    var grid = $("#libGrid");
    if (!grid) return;
    var mode = $("#libSort") ? $("#libSort").value : "cat";
    var cards = $$(".card", grid);
    cards.sort(function (a, b) {
      if (mode === "az") return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"), "vi");
      if (mode === "new") return Number(b.getAttribute("data-order")) - Number(a.getAttribute("data-order"));
      return Number(a.getAttribute("data-order")) - Number(b.getAttribute("data-order"));
    });
    cards.forEach(function (c) { grid.appendChild(c); });
  }

  function afterLibrary() {
    var search = $("#libSearch");
    if (search) {
      search.addEventListener("input", applyLibFilter);
      onCleanup(function () { search.removeEventListener("input", applyLibFilter); });
    }
    $$(".filters .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        if (chip.hasAttribute("data-bm")) {
          chip.classList.toggle("is-active");
        } else {
          $$(".filters .chip[data-cat]").forEach(function (c) { c.classList.remove("is-active"); });
          chip.classList.add("is-active");
        }
        applyLibFilter();
      });
    });
    var sort = $("#libSort");
    if (sort) sort.addEventListener("change", function () { sortLib(); applyLibFilter(); });
    sortLib();
    applyLibFilter();
  }

  /* --------------------------------------------------------------- article */

  function renderArticle(a) {
    var c = catById(a.cat);
    var idx = LIB.articles.indexOf(a);
    var prev = LIB.articles[idx - 1], next = LIB.articles[idx + 1];
    var related = a.related.map(articleById).filter(Boolean);
    if (!related.length) related = LIB.articles.filter(function (x) { return x.cat === a.cat && x.id !== a.id; }).slice(0, 3);
    var toc = a.headings.map(function (h) {
      return '<a href="#' + h.id + '" data-toc="' + h.id + '" class="' + (h.level === 3 ? "toc--3" : "") + '">' + esc(h.text) + '</a>';
    }).join("");

    return '<nav class="crumbs" style="display:none"></nav>' +
      '<header class="article-head">' +
        '<div class="article-head__meta"><span class="pill" style="background:' + c.color + '14;color:var(--navy)">' + esc(c.name) + '</span>' +
          '<span class="small muted">' + icon("clock") + ' ' + a.read + ' phút đọc</span>' +
          '<span class="small muted">Cập nhật ' + fmtDate(a.updated) + '</span></div>' +
        '<h1>' + esc(a.title) + '</h1>' +
        '<p class="article-head__sum">' + esc(a.summary) + '</p>' +
        '<div class="article-head__tools">' +
          '<button class="btn" id="artBookmark" data-id="' + a.id + '">' + icon("bookmark") + '<span>' + (isBookmarked(a.id) ? "Đã lưu" : "Lưu bài") + '</span></button>' +
          '<button class="btn" id="artCopy">' + icon("link") + 'Chép liên kết</button>' +
          '<button class="btn" id="artPrint">' + icon("print") + 'In bài</button>' +
        '</div>' +
      '</header>' +
      '<div class="article-wrap">' +
        '<article class="article-body" id="articleBody">' + a.html +
          '<div class="article-source"><div class="article-source__icon">' + icon("source") + '</div><div>' +
            '<div class="article-source__label">Nguồn gốc</div>' +
            '<div class="article-source__title">' + esc(a.source.label) + '</div>' +
            '<div class="article-source__meta">Slide ' + esc(a.source.slides) + (a.source.memo ? ' · ' + esc(a.source.memo) : '') + '. Nội dung đã tóm tắt, không thay thế văn bản chính sách.</div>' +
          '</div></div>' +
          '<div class="article-nav">' +
            (prev ? '<a href="#/article/' + prev.id + '"><span>Bài trước</span><b>' + esc(prev.title) + '</b></a>' : '<span></span>') +
            (next ? '<a class="next" href="#/article/' + next.id + '"><span>Bài tiếp</span><b>' + esc(next.title) + '</b></a>' : '<span></span>') +
          '</div>' +
        '</article>' +
        '<aside class="toc"><div class="toc__label">Trong bài</div>' + toc +
          '<div class="toc__source"><b>Nguồn</b>' + esc(a.source.label) + '<br>Slide ' + esc(a.source.slides) + (a.source.memo ? '<br>' + esc(a.source.memo) : '') + '</div>' +
        '</aside>' +
      '</div>' +
      '<section class="related">' + sectionHead("Liên quan", "Đọc tiếp", "Các bài cùng chủ đề hoặc cùng logic tính.", null) +
        '<div class="grid grid--3">' + related.map(function (x) { return articleCard(x); }).join("") + '</div>' +
      '</section>';
  }

  function afterArticle(a) {
    var bm = $("#artBookmark");
    if (bm) bm.addEventListener("click", function () {
      var on = toggleBookmark(a.id);
      bm.innerHTML = icon("bookmark") + '<span>' + (on ? "Đã lưu" : "Lưu bài") + '</span>';
    });
    var copy = $("#artCopy");
    if (copy) copy.addEventListener("click", function () {
      var url = location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast("Đã chép liên kết"); }, function () { fallbackCopy(url); });
      } else fallbackCopy(url);
    });
    var print = $("#artPrint");
    if (print) print.addEventListener("click", function () { window.print(); });

    // TOC + progress
    var body = $("#articleBody");
    var progress = $("#progress");
    if (progress) {
      progress.hidden = false;
      progress.innerHTML = '<div class="progress__bar" id="progressBar"></div>';
    }
    var links = $$(".toc a");
    var headings = links.map(function (l) { return document.getElementById(l.getAttribute("data-toc")); }).filter(Boolean);
    links.forEach(function (l) {
      l.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(l.getAttribute("data-toc"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    var onScroll = function () {
      var rect = body.getBoundingClientRect();
      var total = body.offsetHeight - window.innerHeight * 0.6;
      var done = Math.max(0, Math.min(1, (-rect.top + 100) / Math.max(1, total)));
      var bar = $("#progressBar");
      if (bar) bar.style.width = (done * 100).toFixed(1) + "%";
      var current = null;
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top <= 120) current = h.id;
      });
      links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-toc") === current); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(function () { window.removeEventListener("scroll", onScroll); });
    onScroll();
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("Đã chép liên kết"); } catch (e) { toast("Không chép được liên kết"); }
    document.body.removeChild(ta);
  }

  /* --------------------------------------------------------------- tools */

  function renderToolsIndex() {
    return '<div class="page-head"><div><p class="overline">Công cụ</p><h1 class="display">Tính toán chính sách</h1>' +
      '<p>Năm máy tính cho các khoản thưởng và phí dịch vụ thường gặp. Nhập số liệu thật, xem kết quả ngay.</p></div>' +
      '<div class="page-head__count"><b>' + TOOLS.length + '</b> công cụ</div></div>' +
      '<div class="tool-grid">' + TOOLS.map(function (t) {
        return '<a class="tool-card" href="#/tools/' + t.id + '"><div class="tool-card__ico">' + icon(t.icon) + '</div>' +
          '<h3>' + esc(t.title) + '</h3><p>' + esc(t.desc) + '</p>' +
          '<div class="tool-card__meta">' + t.tags.map(function (x) { return '<span class="pill pill--grey">' + esc(x) + '</span>'; }).join("") + '</div></a>';
      }).join("") + '</div>' +
      '<div class="info-card" style="margin-top:20px;border-left:3px solid var(--coral)">' +
        '<h3 class="h3">Trước khi dùng</h3><p>Công cụ tính theo công thức trong deck MBA 04/2026 và dùng đơn vị triệu đồng. Kết quả là ước tính để trao đổi, không phải bảng lương chính thức. Số thực tế lấy từ hệ thống Manulife.</p>' +
      '</div>';
  }

  function renderToolPage(t) {
    return '<div class="tool-head"><p class="overline">Công cụ</p><h1>' + esc(t.title) + '</h1><p>' + esc(t.desc) + '</p></div>' + t.html();
  }

  function afterTool(t) { if (t.mount) t.mount(); }

  /* --------------------------------------------------------------- glossary */

  function renderGlossary(params) {
    var q = params.get("q") || "";
    var sorted = LIB.glossary.slice().sort(function (a, b) { return a.term.localeCompare(b.term, "vi"); });
    var letters = "ABCDĐGHIKLMNOPQRSTUVXY".split("");
    return '<div class="page-head"><div><p class="overline">Tra cứu</p><h1 class="display">Thuật ngữ</h1>' +
      '<p>' + LIB.glossary.length + ' định nghĩa đang dùng trong chính sách, báo cáo và email chỉ số. Gõ để lọc, chọn chữ cái để nhảy nhanh.</p></div></div>' +
      '<div class="filters" style="top:64px">' +
        '<div class="searchfield">' + icon("search") + '<input id="glossSearch" type="search" value="' + esc(q) + '" placeholder="Tìm thuật ngữ hoặc định nghĩa..." aria-label="Tìm thuật ngữ"></div>' +
      '</div>' +
      '<div class="alpha" id="alpha"><button class="is-active" data-letter="">Tất cả</button>' + letters.map(function (l) { return '<button data-letter="' + l + '">' + l + '</button>'; }).join("") + '</div>' +
      '<div class="gloss-grid" id="glossGrid">' + sorted.map(function (g) {
        var first = norm(g.term).charAt(0).toUpperCase();
        return '<div class="term" id="term-' + esc(norm(g.term).replace(/[^a-z0-9]+/g, "-")) + '" data-letter="' + first + '" data-search="' + esc(norm(g.term + " " + g.def + " " + g.cat)) + '">' +
          '<div class="term__head"><h3>' + esc(g.term) + '</h3><span class="term__cat">' + esc(g.cat) + '</span></div><p>' + esc(g.def) + '</p>' +
          (g.article ? '<a href="#/article/' + g.article + '">Đọc bài liên quan' + icon("arrow") + '</a>' : "") + '</div>';
      }).join("") + '</div>' +
      '<div class="empty" id="glossEmpty" hidden><h3>Không tìm thấy thuật ngữ</h3><p>Thử chữ cái khác hoặc từ khóa ngắn hơn.</p></div>';
  }

  function applyGlossFilter() {
    var q = norm($("#glossSearch") ? $("#glossSearch").value : "");
    var active = $("#alpha .is-active");
    var letter = active ? active.getAttribute("data-letter") : "";
    var terms = $$(".term", $("#glossGrid"));
    var shown = 0;
    terms.forEach(function (t) {
      var ok = (!letter || t.getAttribute("data-letter") === letter) && (!q || t.getAttribute("data-search").indexOf(q) >= 0);
      t.hidden = !ok;
      if (ok) shown++;
    });
    var empty = $("#glossEmpty");
    if (empty) empty.hidden = shown !== 0;
  }

  function afterGlossary() {
    var input = $("#glossSearch");
    if (input) input.addEventListener("input", applyGlossFilter);
    $$("#alpha button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#alpha button").forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        applyGlossFilter();
      });
    });
    applyGlossFilter();
  }

  /* --------------------------------------------------------------- paths */

  function renderPaths() {
    return '<div class="page-head"><div><p class="overline">Lộ trình</p><h1 class="display">Đi theo vai trò</h1>' +
      '<p>Bốn đường đi từ ngày đầu đến khi có đội. Mỗi bước mở đúng bài đọc hoặc công cụ cần dùng.</p></div></div>' +
      LIB.paths.map(function (p) {
        return '<section class="pathway" id="path-' + p.id + '" style="--pc:' + p.color + '">' +
          '<div class="pathway__intro"><div class="sub">' + esc(p.sub) + '</div><h2>' + esc(p.name) + '</h2><p>' + esc(p.desc) + '</p></div>' +
          '<div class="steps">' + p.steps.map(function (s, i) {
            return '<div class="step"><div class="step__num">' + pad(i + 1) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p>' +
              (s.article ? '<a href="#/article/' + s.article + '">Mở bài' + icon("arrow") + '</a>' : "") + '</div>';
          }).join("") + '</div>' +
        '</section>';
      }).join("");
  }

  function afterPaths(params) {
    var id = params.get("p");
    if (!id) return;
    var el = document.getElementById("path-" + id);
    if (el) setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  }

  /* --------------------------------------------------------------- sources */

  function renderSources() {
    var docs = LIB.docs || [];
    var policyDocs = docs.filter(function (d) { return d.group === "chinh-sach"; });
    var onboarding = docs.filter(function (d) { return d.group !== "chinh-sach"; });
    function docGroup(title, list) {
      return list.length ? '<div class="doc-group"><h3>' + title + '</h3><div class="doc-grid">' + list.map(docCard).join("") + '</div></div>' : "";
    }
    return '<div class="page-head"><div><p class="overline">Nguồn tài liệu</p><h1 class="display">Bản đồ nguồn</h1>' +
      '<p>Mỗi bài trong thư viện trỏ về một memo và một deck. Mở thẳng tài liệu gốc để kiểm tra chéo, trích dẫn hoặc đào tạo lại.</p></div>' +
      '<div class="page-head__count"><b>' + docs.length + '</b> tài liệu PDF</div></div>' +
      '<p class="doc-intro">' + icon("info") + ' Tài liệu chính sách được mã hóa bằng mật khẩu nội bộ. Khi trình duyệt hỏi mật khẩu, nhập mật khẩu đội ngũ. Không đăng mật khẩu lên website hoặc nhóm công khai.</p>' +
      docGroup("Chính sách 2026", policyDocs) +
      docGroup("Onboarding và tuân thủ", onboarding) +
      '<div class="section" style="margin-top:30px">' + sectionHead("Bản đồ memo", "Từ bài viết về văn bản gốc", "Bảng dưới đây nối từng memo với deck và slide tương ứng. Cột cuối mở đúng trang PDF.", null) +
      '<div class="table-wrap"><table class="source-table"><thead><tr><th>Memo</th><th>Nội dung</th><th>Hiệu lực</th><th>Deck và slide</th><th>Tài liệu</th></tr></thead><tbody>' +
      LIB.sources.map(function (s) {
        var href = s.doc ? "#/doc/" + s.doc + "?page=" + (s.docPage || 1) : "";
        var title = s.doc ? '<a href="' + href + '">' + esc(s.title) + '</a>' : '<strong>' + esc(s.title) + '</strong>';
        var action = s.doc ? '<a class="src-open" href="' + href + '">Mở ' + icon("arrow") + '</a>' : '<span class="src-none">' + esc(s.docNote || "Nội bộ") + '</span>';
        return '<tr><td class="memo">' + esc(s.memo) + '</td><td>' + title + '<br>' + esc(s.topics) + '</td><td>' + esc(s.effective) + '</td><td>' + esc(s.deck) + '<br><span class="src-slide">Slide ' + esc(s.slides) + '</span></td><td>' + action + '</td></tr>';
      }).join("") + '</tbody></table></div></div>' +
      '<div class="info-grid">' +
        '<div class="info-card"><h3>Cập nhật nội dung</h3><ul>' +
          '<li>Bài viết nằm trong <code>content/articles/*.md</code>, có front matter và phần thân Markdown.</li>' +
          '<li>Sửa hoặc thêm file, sau đó chạy <code>python build.py</code> để tạo lại <code>site/data.js</code>.</li>' +
          '<li>Thuật ngữ ở <code>content/glossary.json</code>; lộ trình ở <code>content/paths.json</code>; nguồn ở <code>content/sources.json</code>; tài liệu ở <code>content/docs.json</code>.</li>' +
          '<li>Build sẽ báo lỗi nếu thiếu trường, sai chủ đề, link liên quan không tồn tại, thiếu file PDF hoặc có dấu gạch dài U+2014.</li>' +
        '</ul></div>' +
        '<div class="info-card"><h3>Phạm vi sử dụng</h3><p>Thư viện phục vụ công việc nội bộ tại VP Đà Nẵng. Nội dung bài viết là bản tóm tắt, không phải văn bản chính sách chính thức và không thay thế tư vấn của bộ phận compliance.</p><p style="margin-top:8px">Bản công khai trên GitHub Pages chỉ chứa tóm tắt và PDF đã mã hóa. Khi có memo mới, cập nhật bài tương ứng và ghi ngày hiệu lực mới.</p></div>' +
        '<div class="info-card"><h3>Đường dẫn gốc trên máy</h3><ul>' +
          '<li><code>Documents/Manulife/MBA/01_Chính_sách_FA...pptx</code></li>' +
          '<li><code>Documents/Manulife/MBA/02. Chính sách UM...pptx</code></li>' +
          '<li><code>Documents/Manulife/MBA/03. Chính sách PSM...pptx</code></li>' +
          '<li><code>Documents/Manulife/Library/site/docs/*.pdf</code></li>' +
        '</ul></div>' +
        '<div class="info-card"><h3>Ấn bản</h3><p><strong>' + esc(LIB.meta.edition) + '</strong></p><p>Dữ liệu tạo ngày ' + fmtDate(LIB.meta.updated) + '.</p><p style="margin-top:8px">' + LIB.meta.counts.articles + ' bài, ' + LIB.meta.counts.glossary + ' thuật ngữ, ' + TOOLS.length + ' công cụ, ' + docs.length + ' tài liệu.</p></div>' +
      '</div>';
  }

  /* --------------------------------------------------------------- 404 */

  function render404(msg) {
    return '<div class="empty" style="margin-top:60px"><h3>' + esc(msg) + '</h3><p>Đường dẫn có thể đã đổi hoặc bài chưa được tạo.</p>' +
      '<p style="margin-top:16px"><a class="btn btn--primary" href="#/">Về trang chủ</a></p></div>';
  }

  /* --------------------------------------------------------------- search */

  var INDEX = [];
  function buildIndex() {
    INDEX = [];
    LIB.articles.forEach(function (a) {
      INDEX.push({
        type: "article", href: "#/article/" + a.id, title: a.title,
        sub: a.summary, cat: catById(a.cat).name, icon: "book",
        ntitle: norm(a.title),
        ntext: norm(a.title + " " + a.summary + " " + a.tags.join(" ") + " " + a.plain + " " + catById(a.cat).name)
      });
    });
    TOOLS.forEach(function (t) {
      INDEX.push({
        type: "tool", href: "#/tools/" + t.id, title: t.title,
        sub: t.short, cat: "Công cụ", icon: t.icon || "calc",
        ntitle: norm(t.title),
        ntext: norm(t.title + " " + t.desc + " " + t.tags.join(" "))
      });
    });
    LIB.glossary.forEach(function (g) {
      INDEX.push({
        type: "term", href: g.article ? "#/article/" + g.article : "#/glossary", title: g.term,
        sub: g.def, cat: "Thuật ngữ", icon: "book",
        ntitle: norm(g.term),
        ntext: norm(g.term + " " + g.def + " " + g.cat)
      });
    });
    (LIB.docs || []).forEach(function (d) {
      INDEX.push({
        type: "doc", href: "#/doc/" + d.id, title: d.title,
        sub: d.desc, cat: "Tài liệu", icon: "source",
        ntitle: norm(d.title),
        ntext: norm(d.title + " " + d.short + " " + d.desc + " " + d.kind + " " + d.memo + " " + d.effective)
      });
    });
    [
      { title: "Lộ trình phát triển", sub: "Bốn đường đi theo vai trò", href: "#/paths", icon: "path" },
      { title: "Nguồn tài liệu", sub: "Memo, deck và cách cập nhật", href: "#/sources", icon: "source" },
      { title: "Tra cứu thuật ngữ", sub: "Toàn bộ định nghĩa", href: "#/glossary", icon: "book" }
    ].forEach(function (p) {
      INDEX.push({ type: "page", href: p.href, title: p.title, sub: p.sub, cat: "Trang", icon: p.icon, ntitle: norm(p.title), ntext: norm(p.title + " " + p.sub) });
    });
  }

  function searchAll(q) {
    var nq = norm(q);
    if (!nq) return [];
    var tokens = nq.split(" ").filter(Boolean);
    var ranked = INDEX.map(function (it) {
      var score = 0;
      if (it.ntitle === nq) score += 120;
      else if (it.ntitle.indexOf(nq) === 0) score += 70;
      else if (it.ntitle.indexOf(nq) >= 0) score += 45;
      var titleHits = tokens.filter(function (t) { return it.ntitle.indexOf(t) >= 0; }).length;
      score += titleHits * 14;
      if (titleHits === tokens.length) score += 22;
      if (it.ntext.indexOf(nq) >= 0) score += 16;
      var hits = tokens.filter(function (t) { return it.ntext.indexOf(t) >= 0; }).length;
      score += hits * 4;
      if (hits === tokens.length) score += 8;
      return { it: it, score: score };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });

    var limits = { article: 6, tool: 3, term: 5, page: 3, doc: 3 };
    var used = {}, out = [];
    ranked.forEach(function (x) {
      var t = x.it.type;
      used[t] = used[t] || 0;
      if (used[t] < (limits[t] || 3)) { out.push(x.it); used[t]++; }
    });
    return out;
  }

  var paletteFlat = [];
  var paletteActive = 0;

  function paletteItem(it, idx) {
    return '<a class="presult' + (idx === 0 ? " is-active" : "") + '" href="' + it.href + '" data-idx="' + idx + '">' +
      '<span class="presult__ico">' + icon(it.icon || "book") + '</span>' +
      '<span class="presult__body"><span class="presult__title">' + esc(it.title) + '</span><span class="presult__sub">' + esc(it.sub) + '</span></span>' +
      '<span class="presult__cat">' + esc(it.cat) + '</span></a>';
  }

  function renderPalette(q) {
    var body = $("#paletteBody");
    var items = q ? searchAll(q) : INDEX.filter(function (it) { return it.type === "article"; }).slice(0, 5).concat(TOOLS.slice(0, 3).map(function (t) {
      return { type: "tool", href: "#/tools/" + t.id, title: t.title, sub: t.short, cat: "Công cụ", icon: t.icon };
    })).concat((LIB.docs || []).slice(0, 2).map(function (d) {
      return { type: "doc", href: "#/doc/" + d.id, title: d.title, sub: d.short, cat: "Tài liệu", icon: "source" };
    }));
    paletteFlat = items;
    paletteActive = 0;
    if (!q) {
      var heads = '<div class="palette__group">Gợi ý</div>';
      body.innerHTML = heads + items.map(function (it, i) { return paletteItem(it, i); }).join("");
    } else if (!items.length) {
      body.innerHTML = '<div class="palette__empty">Không tìm thấy "' + esc(q) + '". Thử tên khoản thưởng, chỉ số hoặc chức danh.</div>';
    } else {
      var groups = [["article", "Bài viết"], ["doc", "Tài liệu"], ["tool", "Công cụ"], ["term", "Thuật ngữ"], ["page", "Trang"]];
      var html = "", idx = 0;
      groups.forEach(function (g) {
        var list = items.filter(function (it) { return it.type === g[0]; });
        if (!list.length) return;
        html += '<div class="palette__group">' + g[1] + '</div>';
        list.forEach(function (it) { html += paletteItem(it, idx++); });
      });
      body.innerHTML = html;
    }
    $$(".presult", body).forEach(function (el) {
      el.addEventListener("click", function () { closePalette(); });
    });
  }

  function openPalette(q) {
    var p = $("#palette"), scrim = $("#scrim");
    if (!p) return;
    closeRail();
    p.hidden = false;
    scrim.hidden = false;
    document.body.style.overflow = "hidden";
    var input = $("#paletteInput");
    input.value = q || "";
    renderPalette(q || "");
    setTimeout(function () { input.focus(); input.select(); }, 20);
  }

  function closePalette() {
    var p = $("#palette"), scrim = $("#scrim");
    if (p) p.hidden = true;
    if (scrim && !$("#rail").classList.contains("is-open")) scrim.hidden = true;
    document.body.style.overflow = "";
  }

  function movePalette(delta) {
    var els = $$(".presult");
    if (!els.length) return;
    paletteActive = (paletteActive + delta + els.length) % els.length;
    els.forEach(function (el, i) { el.classList.toggle("is-active", i === paletteActive); });
    var active = els[paletteActive];
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
  }

  function wirePalette() {
    var input = $("#paletteInput");
    if (!input) return;
    input.addEventListener("input", function () { renderPalette(input.value.trim()); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); movePalette(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePalette(-1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var active = $$(".presult")[paletteActive];
        if (active) { var href = active.getAttribute("href"); closePalette(); location.hash = href.replace(/^#/, ""); }
      } else if (e.key === "Escape") { closePalette(); }
    });
    $("#scrim").addEventListener("click", closePalette);
  }

  /* --------------------------------------------------------------- rail + chrome */

  function closeRail() {
    var rail = $("#rail");
    if (rail) rail.classList.remove("is-open");
    var scrim = $("#scrim");
    if (scrim && $("#palette").hidden) scrim.hidden = true;
    var btn = $("#menuBtn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function wireChrome() {
    $("#searchBtn").addEventListener("click", function () { openPalette(""); });
    $("#tabSearch").addEventListener("click", function () { openPalette(""); });
    $("#bookmarkBtn").addEventListener("click", function () { location.hash = "#/library?bookmarks=1"; });
    $("#menuBtn").addEventListener("click", function () {
      var rail = $("#rail");
      var open = rail.classList.toggle("is-open");
      $("#scrim").hidden = !open;
      $("#menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
    });
    $("#scrim").addEventListener("click", function () {
      if (!$("#palette").hidden) closePalette(); else closeRail();
    });
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      var typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(""); }
      else if (e.key === "/" && !typing && $("#palette").hidden) { e.preventDefault(); openPalette(""); }
      else if (e.key === "Escape") {
        if (!$("#palette").hidden) closePalette();
        else closeRail();
      }
    });
  }

  function renderRailCats() {
    var el = $("#railCats");
    if (!el) return;
    el.innerHTML = LIB.categories.map(function (c) {
      var n = LIB.articles.filter(function (a) { return a.cat === c.id; }).length;
      return '<a class="catlink" href="#/library?cat=' + c.id + '" data-cat="' + c.id + '"><span class="dot" style="background:' + c.color + '"></span><span>' + esc(c.name) + '</span><span class="catlink__count">' + n + '</span></a>';
    }).join("");
  }

  function updateChrome() {
    updateBadge();
    renderRailCats();
    var foot = $("#footCount");
    if (foot) foot.textContent = LIB.meta.counts.articles + " bài viết · " + (LIB.meta.counts.docs || 0) + " tài liệu";
    var upd = $("#railUpdated");
    if (upd) upd.textContent = fmtDate(LIB.meta.updated);
  }

  /* --------------------------------------------------------------- boot */

  function boot() {
    $$("[data-ico]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-ico")); });
    buildIndex();
    updateChrome();
    wireChrome();
    wirePalette();
    window.addEventListener("hashchange", render);
    if (!location.hash) history.replaceState(null, "", "#/");
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
