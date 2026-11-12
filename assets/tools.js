/* Calculator UI. Depends on window.Calc and window.icon. */
(function () {
  "use strict";

  var C = window.Calc;
  var fmt = function (n, d) {
    d = d == null ? 2 : d;
    return Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: d });
  };
  var pct = function (n, d) { return fmt(n * 100, d == null ? 2 : d) + "%"; };
  var val = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
  var checked = function (id) { var el = document.getElementById(id); return !!(el && el.checked); };
  var num = function (id) { return C.n(val(id)); };

  function field(id, label, value, hint, attrs) {
    return '<div class="formrow"><label for="' + id + '">' + label + '</label>' +
      '<input id="' + id + '" type="number" inputmode="decimal" step="any" value="' + value + '" ' + (attrs || "") + '>' +
      (hint ? '<span class="hint">' + hint + '</span>' : "") + '</div>';
  }
  function select(id, label, options, hint) {
    return '<div class="formrow"><label for="' + id + '">' + label + '</label><select id="' + id + '">' +
      options.map(function (o) { return '<option value="' + o[0] + '"' + (o[2] ? " selected" : "") + '>' + o[1] + '</option>'; }).join("") +
      '</select>' + (hint ? '<span class="hint">' + hint + '</span>' : "") + '</div>';
  }
  function check(id, label, on) {
    return '<label class="checkrow"><input id="' + id + '" type="checkbox"' + (on ? " checked" : "") + '><span>' + label + '</span></label>';
  }
  function resultShell() {
    return '<div class="tool__result" id="toolResult" aria-live="polite"></div>';
  }
  function setResult(html) {
    var el = document.getElementById("toolResult");
    if (el) el.innerHTML = html;
  }
  function big(label, number, unit, note, table) {
    return '<div class="tool__result-label">' + label + '</div>' +
      '<div class="tool__result-number">' + number + '</div>' +
      '<div class="tool__result-unit">' + unit + '</div>' +
      (note ? '<div class="tool__result-note">' + note + '</div>' : "") +
      (table ? '<table>' + table + '</table>' : "");
  }
  function rows(items) {
    return items.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("");
  }

  /* ------------------------------------------------------------- FA income */

  function faHtml() {
    return '<div class="tool" id="toolRoot">' +
      '<div class="tool__form">' +
        '<div class="tabs" role="tablist">' +
          '<button class="tab is-active" data-tab="thang" role="tab">Thưởng tháng</button>' +
          '<button class="tab" data-tab="quy" role="tab">Thưởng quý</button>' +
          '<button class="tab" data-tab="moi" role="tab">Đại lý mới</button>' +
          '<button class="tab" data-tab="mstar" role="tab">M-Star</button>' +
          '<button class="tab" data-tab="pro" role="tab">Pro tháng</button>' +
          '<button class="tab" data-tab="nam" role="tab">Thưởng năm</button>' +
        '</div>' +
        '<div class="formbody">' +
          '<section data-panel="thang">' +
            '<div class="formgrid">' +
              field("fa-months", "Số tháng làm việc", 3, "Tính từ M0. Từ 6 tháng trở xuống dùng mức 1 đến 7.") +
              field("fa-fyc3", "FYC cộng dồn 3 tháng gần nhất (triệu)", 38, "Không phải FYC một tháng.") +
              field("fa-fycm", "FYC tháng xét thưởng (triệu)", 18, "FYC phát sinh trong tháng đang tính.") +
              field("fa-cc", "Số hợp đồng thực cấp trong tháng", 3, "Cần tối thiểu 1 hợp đồng.") +
              field("fa-p13", "Tỷ lệ P13 (%)", 70, "Để trống nếu chưa có P13.") +
              select("fa-dis", "Kỷ luật trong tháng", [["none", "Không vi phạm", true], ["reminder", "Thư nhắc nhở"], ["warning", "Thư cảnh cáo"], ["termination", "Chấm dứt hợp đồng"]]) +
            '</div>' +
          '</section>' +
          '<section data-panel="quy" hidden>' +
            '<div class="formgrid">' +
              field("faq-months", "Số tháng làm việc", 3, "Mức 1 chỉ dành cho đại lý từ 6 tháng trở xuống.") +
              field("faq-fyc", "FYC phát sinh trong quý (triệu)", 56, "Tổng FYC của 3 tháng trong quý.") +
              field("faq-p13", "Tỷ lệ P13 (%)", 70, "Lấy tại cuối tháng cuối quý.") +
              select("faq-dis", "Kỷ luật trong tháng cuối quý", [["none", "Không vi phạm", true], ["reminder", "Thư nhắc nhở"], ["warning", "Thư cảnh cáo"], ["termination", "Chấm dứt hợp đồng"]]) +
            '</div>' +
            check("faq-ex", "Đại lý xuất sắc: thưởng tháng 3 tháng liên tiếp, hoặc Pro Vàng/Bạch Kim cuối quý", true) +
          '</section>' +
          '<section data-panel="moi" hidden>' +
            '<h3 class="h3" style="margin:4px 0 10px">Tháng làm việc đầy đủ đầu tiên (M0 + M1)</h3>' +
            '<div class="formgrid">' +
              field("fan-fyp1", "FYP (triệu)", 20, "Ngưỡng thưởng cơ bản: 10 triệu.") +
              field("fan-cc1", "Số hợp đồng", 1, "Ngưỡng: 1 hợp đồng.") +
              field("fan-att1", "Số buổi chuyên cần", 7, "Ngưỡng: 4 buổi.") +
              select("fan-sbw1", "SBW", [["1", "Đã hoàn thành", true], ["0", "Chưa hoàn thành"]]) +
            '</div>' +
            '<h3 class="h3" style="margin:16px 0 10px">Tháng làm việc thứ 2 (M2)</h3>' +
            '<div class="formgrid">' +
              field("fan-fyp2", "FYP (triệu)", 20, "Ngưỡng thưởng cơ bản: 10 triệu.") +
              field("fan-cc2", "Số hợp đồng", 2, "Ngưỡng: 1 hợp đồng.") +
              field("fan-att2", "Số buổi chuyên cần", 4, "Ngưỡng: 4 buổi.") +
              select("fan-sbw2", "SBW", [["1", "Đã hoàn thành", true], ["0", "Chưa hoàn thành"]]) +
            '</div>' +
            '<div class="formgrid" style="margin-top:10px">' +
              field("fan-p13", "Tỷ lệ P13 (%)", 70, "Để trống nếu chưa có.") +
              select("fan-dis", "Kỷ luật trong tháng M2", [["none", "Không vi phạm", true], ["reminder", "Thư nhắc nhở"], ["warning", "Thư cảnh cáo"], ["termination", "Chấm dứt hợp đồng"]]) +
            '</div>' +
          '</section>' +
          '<section data-panel="mstar" hidden>' +
            '<div class="formgrid">' +
              select("ms-q", "Quý xét thưởng", [["1", "Quý 1", true], ["2", "Quý 2"], ["3", "Quý 3"], ["4", "Quý 4"]]) +
              field("ms-cum", "FYP cộng dồn từ đầu năm (triệu)", 61.2, "Mốc quý 1: 60 triệu. Quý 2: 430 triệu. Quý 3: 750 triệu. Quý 4: 1.073,6452 tỷ.") +
              field("ms-p13", "Tỷ lệ P13 (%)", 70, "Lấy tại tháng cuối quý.") +
              field("ms-annual", "FYP dự kiến cả năm (triệu)", 1073.6452, "Mốc thưởng năm: 1.073,6452 tỷ, 2 tỷ, 3 tỷ.") +
              field("ms-received", "Thưởng M-Star quý đã nhận trong năm (triệu)", 0, "Dùng để tính phần còn lại của thưởng năm.") +
              select("ms-dis", "Kỷ luật trong tháng cuối quý", [["none", "Không vi phạm", true], ["reminder", "Thư nhắc nhở"], ["warning", "Thư cảnh cáo"], ["termination", "Chấm dứt hợp đồng"]]) +
            '</div>' +
            check("ms-active", "Hoạt động đủ mỗi tháng trong quý: 1 hợp đồng và 4 triệu FYC", true) +
          '</section>' +
          '<section data-panel="pro" hidden>' +
            '<h3 class="h3" style="margin:4px 0 10px">Thưởng năng suất xuất sắc tháng</h3>' +
            '<div class="formgrid">' +
              field("fa-pro-fyp", "FYP tháng xét thưởng (triệu)", 85, "Mốc thấp nhất: 15 triệu.") +
              select("fa-pro-title", "Hạng Manulife Pro", [["bac", "Bạc"], ["vang", "Vàng"], ["bachkim", "Bạch Kim", true]]) +
              field("fa-pro-p13", "Tỷ lệ P13 (%)", 72, "Lấy tại cuối tháng xét thưởng.") +
              select("fa-pro-dis", "Kỷ luật trong tháng", [["none", "Không vi phạm", true], ["reminder", "Thư nhắc nhở"], ["warning", "Thư cảnh cáo"], ["termination", "Chấm dứt hợp đồng"]]) +
            '</div>' +
            check("fa-pro-mdrt", "Đạt điều kiện MDRT để xét mức 120 triệu (chỉ Bạch Kim)", false) +
          '</section>' +
          '<section data-panel="nam" hidden>' +
            '<h3 class="h3" style="margin:4px 0 10px">Thưởng kinh doanh xuất sắc năm</h3>' +
            '<div class="formgrid">' +
              field("fa-nam-cc", "Số hợp đồng trong năm", 24) +
              field("fa-nam-fyp", "FYP trong năm (triệu)", 600) +
              field("fa-nam-months", "Số tháng làm việc", 24, "Dùng để chọn mức Vàng trên 12 tháng hoặc 12 tháng trở xuống.") +
              select("fa-nam-title", "Hạng Manulife Pro", [["vang", "Vàng"], ["bachkim", "Bạch Kim", true]]) +
              field("fa-nam-fyc", "FYC trong năm (triệu)", 800, "Thưởng là 10% hoặc 15% FYC, tối đa 100 triệu.") +
              field("fa-nam-p13", "Tỷ lệ P13 tháng 12 (%)", 70, "Điều kiện chi trả: từ 70%.") +
              select("fa-nam-dis", "Kỷ luật tháng 12", [["none", "Không vi phạm", true], ["reminder", "Thư nhắc nhở"], ["warning", "Thư cảnh cáo"], ["termination", "Chấm dứt hợp đồng"]]) +
            '</div>' +
          '</section>' +
          '<p class="assume">Đơn vị tính là triệu đồng. Công thức theo chính sách FA 2026 (memo 0046M01/2026/ASBD). Tỷ lệ FYC trên FYP phụ thuộc sản phẩm; công cụ này nhập trực tiếp FYC.</p>' +
        '</div>' +
      '</div>' +
      resultShell() +
    '</div>';
  }

  function faUpdate() {
    var active = document.querySelector('#toolRoot .tab.is-active').getAttribute("data-tab");
    if (active === "thang") {
      var r = C.monthlyProductivity({ months: num("fa-months"), fyc3: num("fa-fyc3"), fycMonth: num("fa-fycm"), cc: num("fa-cc"), p13: val("fa-p13"), discipline: val("fa-dis") });
      setResult(big("Thưởng năng suất tháng", fmt(r.total), "triệu đồng", r.eligible ? "Mức " + r.tier + ", tỷ lệ " + pct(r.rate) + " trên FYC tháng." : "Không đủ điều kiện: cần ít nhất 1 hợp đồng thực cấp trong tháng.", rows([
        ["FYC 3 tháng gần nhất", fmt(r.fyc3) + " tr"],
        ["FYC tháng xét thưởng", fmt(r.fycMonth) + " tr"],
        ["Mức thưởng", r.tier ? "Mức " + r.tier : "Không đạt"],
        ["Tỷ lệ", pct(r.rate)],
        ["Thưởng trước hệ số", fmt(r.base) + " tr"],
        ["Hệ số P13", pct(r.p13Mult, 0)],
        ["Hệ số CLKD", pct(r.clkdMult, 0)]
      ])));
    } else if (active === "quy") {
      var q = C.quarterly({ months: num("faq-months"), fycQuarter: num("faq-fyc"), excellent: checked("faq-ex"), p13: val("faq-p13"), discipline: val("faq-dis") });
      setResult(big("Thưởng năng suất quý", fmt(q.total), "triệu đồng", q.tier ? "Mức " + q.tier + ", tỷ lệ " + pct(q.rate) + " trên FYC quý." : "Chưa đạt mức FYC tối thiểu của quý.", rows([
        ["FYC trong quý", fmt(num("faq-fyc")) + " tr"],
        ["Mức thưởng", q.tier ? "Mức " + q.tier : "Không đạt"],
        ["Tỷ lệ", pct(q.rate)],
        ["Thưởng trước hệ số", fmt(q.base) + " tr"],
        ["Hệ số P13", pct(q.p13Mult, 0)],
        ["Hệ số CLKD", pct(q.clkdMult, 0)]
      ])));
    } else if (active === "moi") {
      var m = C.newAgent({
        m1: { fyp: num("fan-fyp1"), cc: num("fan-cc1"), attendance: num("fan-att1"), sbw: val("fan-sbw1") === "1" },
        m2: { fyp: num("fan-fyp2"), cc: num("fan-cc2"), attendance: num("fan-att2"), sbw: val("fan-sbw2") === "1" },
        p13: val("fan-p13"), discipline: val("fan-dis")
      });
      setResult(big("Tổng thưởng khởi động", fmt(m.total), "triệu đồng", m.excellent ? "Gồm thưởng tháng M1, M2 và thưởng đại lý mới xuất sắc 5 triệu; đủ điều kiện thăng hạng nhanh Manulife Pro Bạc." : "Gồm thưởng tháng M1 và M2. Chưa đạt thưởng đại lý mới xuất sắc (cần 3 hợp đồng, 40 triệu FYP, đủ chuyên cần và SBW).", rows([
        ["Tháng M0 + M1", fmt(m.m1.base) + " tr"],
        ["Tháng M2", fmt(m.m2.base) + " tr"],
        ["Thưởng xuất sắc", m.excellent ? "5,00 tr" : "0,00 tr"],
        ["Trước hệ số", fmt(m.base) + " tr"],
        ["Hệ số P13", pct(m.p13Mult, 0)],
        ["Hệ số CLKD", pct(m.clkdMult, 0)]
      ])));
    } else if (active === "pro") {
      var pro = C.proMonthly({ fyp: num("fa-pro-fyp"), title: val("fa-pro-title"), p13: val("fa-pro-p13"), discipline: val("fa-pro-dis"), mdrt: checked("fa-pro-mdrt") });
      setResult(big("Thưởng năng suất xuất sắc tháng", fmt(pro.total), "triệu đồng", pro.tier ? "Mức FYP từ " + pro.tier + " triệu, hạng " + (val("fa-pro-title") === "bachkim" ? "Bạch Kim" : val("fa-pro-title") === "vang" ? "Vàng" : "Bạc") + "." : "Hạng này không có mức thưởng cho FYP đã nhập.", rows([
        ["Mức FYP áp dụng", pro.tier ? "Từ " + pro.tier + " tr" : "Không có"],
        ["Thưởng trước hệ số", fmt(pro.base) + " tr"],
        ["Hệ số P13", pct(pro.p13Mult, 0)],
        ["Hệ số CLKD", pct(pro.clkdMult, 0)]
      ])));
    } else if (active === "nam") {
      var an = C.annualExcellence({ title: val("fa-nam-title"), cc: num("fa-nam-cc"), fyp: num("fa-nam-fyp"), months: num("fa-nam-months"), fycYear: num("fa-nam-fyc"), p13: num("fa-nam-p13"), discipline: val("fa-nam-dis") });
      setResult(big("Thưởng kinh doanh xuất sắc năm", fmt(an.total), "triệu đồng", an.eligible ? "Đủ điều kiện. Chi trả 50%, 30%, 20% trong ba năm nếu P13 mỗi năm từ 70%." : "Chưa đủ điều kiện hợp đồng, FYP hoặc P13.", rows([
        ["Thưởng trước hệ số", fmt(an.base) + " tr"],
        ["Năm 1 (50%)", fmt(an.y1) + " tr"],
        ["Năm 2 (30%)", fmt(an.y2) + " tr"],
        ["Năm 3 (20%)", fmt(an.y3) + " tr"]
      ])));
    } else {
      var s = C.mstar({ quarter: num("ms-q"), cumFyp: num("ms-cum"), activeAll: checked("ms-active"), p13: val("ms-p13"), discipline: val("ms-dis") });
      var a = C.mstarAnnual({ annualFyp: num("ms-annual"), quartersReceived: num("ms-received"), p13: val("ms-p13"), discipline: val("ms-dis") });
      setResult(big("Thưởng M-Star quý", fmt(s.total), "triệu đồng", s.active ? "Đạt " + pct(s.ratio, 1) + " mốc FYP quý " + s.quarter + "." : "Không đủ hoạt động mỗi tháng trong quý.", rows([
        ["Mốc FYP quý " + s.quarter, fmt(s.target) + " tr"],
        ["FYP cộng dồn", fmt(num("ms-cum")) + " tr"],
        ["Tỷ lệ đạt", pct(s.ratio, 1)],
        ["Thưởng quý trước hệ số", fmt(s.base) + " tr"],
        ["Thưởng năm dự kiến", fmt(a.gross) + " tr"],
        ["Còn lại sau cấn trừ", fmt(a.net) + " tr"]
      ])));
    }
  }

  function mountFa() {
    var root = document.getElementById("toolRoot");
    root.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        root.querySelectorAll(".tab").forEach(function (b) { b.classList.remove("is-active"); });
        root.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = true; });
        btn.classList.add("is-active");
        root.querySelector('[data-panel="' + btn.getAttribute("data-tab") + '"]').hidden = false;
        faUpdate();
      });
    });
    root.addEventListener("input", faUpdate);
    root.addEventListener("change", faUpdate);
    faUpdate();
  }

  /* ------------------------------------------------------------- UM fees */

  function umHtml() {
    return '<div class="tool" id="toolRoot">' +
      '<div class="tool__form"><div class="formbody">' +
        '<h3 class="h3" style="margin:2px 0 10px">Phí năng suất nhóm</h3>' +
        '<div class="formgrid">' +
          field("um-f1", "FYC cấp 1 (triệu)", 70) +
          field("um-f2", "FYC cấp 2 (triệu)", 40) +
          field("um-f3", "FYC cấp 3 (triệu)", 20) +
          field("um-f4", "FYC cấp 4 (triệu)", 0) +
        '</div>' +
        '<h3 class="h3" style="margin:16px 0 10px">Phí hoạt động nhóm</h3>' +
        '<div class="formgrid">' +
          field("um-producing", "Số đại lý/UM+ trực tiếp có sản xuất", 6, "Tối thiểu 1 hợp đồng và 4 triệu FYC mỗi người.") +
          field("um-pool", "Tổng thưởng năng suất tháng và quý của cấp trực tiếp (triệu)", 30) +
          field("um-p13", "Tỷ lệ P13 (%)", 83) +
          field("um-att", "Số buổi chuyên cần của quản lý", 5, "Cần tối thiểu 4 buổi.") +
        '</div>' +
        check("um-mba", "Quản lý đạt danh hiệu MBA Pro", true) +
        '<h3 class="h3" style="margin:16px 0 10px">Phát triển đại lý mới</h3>' +
        '<div class="formgrid">' +
          field("um-newbonus", "Tổng thưởng đại lý mới và xuất sắc của cấp trực tiếp (triệu)", 0, "Để 0 nếu không có đại lý mới trong tháng.") +
          select("um-title", "Hạng MBA Pro cho phí HTDH", [["bac", "Bạc (80%)"], ["vang", "Vàng (100%)", true], ["bachkim", "Bạch Kim (125%)"]]) +
        '</div>' +
        '<p class="assume">Đơn vị tính là triệu đồng. Công thức theo biểu phí UM 2026 (memo 0047M01/2026/ASBD). Phí HTDH là ước tính từ tháng hiện tại nhân 12, chưa phải số tích lũy thực tế.</p>' +
      '</div></div>' + resultShell() + '</div>';
  }

  function umUpdate() {
    var p = C.umProductivity({ fyc1: num("um-f1"), fyc2: num("um-f2"), fyc3: num("um-f3"), fyc4: num("um-f4") });
    var a = C.umActivity({ producing: num("um-producing"), mbaPro: checked("um-mba"), bonusPool: num("um-pool"), p13: val("um-p13"), attendance: num("um-att") });
    var nf = C.umNewAgentFee({ newAgentBonuses: num("um-newbonus"), mbaPro: checked("um-mba"), p13: val("um-p13") });
    var monthly = p.total + a.total + nf.total;
    var lt = C.umLongTerm({ annualActivity: a.total * 12, annualNewAgent: nf.total * 12, title: val("um-title") || "vang" });
    setResult(big("Tổng phí dịch vụ tháng", fmt(monthly), "triệu đồng", a.attendanceOk ? "Chưa gồm phí phát triển nhóm mới; phí HTDH trong bảng chỉ là ước tính." : "Thiếu điều kiện chuyên cần: phí hoạt động nhóm bằng 0.", rows([
      ["Năng suất nhóm", fmt(p.total) + " tr"],
      ["Hoạt động nhóm", fmt(a.total) + " tr (tỷ lệ " + pct(a.rate, 0) + ", P13 " + pct(a.p13Mult, 0) + ")"],
      ["Phát triển đại lý mới", fmt(nf.total) + " tr"],
      ["Ước tính quỹ HTDH năm", fmt(lt.total) + " tr"],
      ["Trả HTDH năm 1", fmt(lt.y1) + " tr"]
    ])));
  }

  function mountUm() {
    var root = document.getElementById("toolRoot");
    root.addEventListener("input", umUpdate);
    root.addEventListener("change", umUpdate);
    umUpdate();
  }

  /* ------------------------------------------------------------- PSM fees */

  function psmHtml() {
    return '<div class="tool" id="toolRoot">' +
      '<div class="tool__form"><div class="formbody">' +
        '<div class="formgrid">' +
          select("psm-title", "Chức danh", [["35", "PSM / SM (35 triệu)", true], ["45", "PSSM / SSM (45 triệu)"]]) +
          field("psm-target", "Chỉ tiêu FYP tháng (triệu)", 400) +
          field("psm-actual", "FYP thực đạt tháng (triệu)", 460) +
          field("psm-rate", "Tỷ lệ FYC trên FYP (%)", 25, "Dùng để tính phí năng suất tháng.") +
          field("psm-aat", "Chỉ tiêu 1mAA_4mFYC quý", 100) +
          field("psm-aaa", "1mAA_4mFYC thực đạt quý", 125) +
          field("psm-p13", "Tỷ lệ P13 khu vực (%)", 80) +
        '</div>' +
        check("psm-indirect", "Quản lý gián tiếp: nhận 50% khoản hỗ trợ", false) +
        '<p class="assume">Đơn vị tính là triệu đồng. Công thức theo biểu phí PSM+ 2026 (memo 0048M01/2026/ASBD). Phí hoạt động quý ước tính từ FYC tháng hiện tại nhân 3; chưa gồm phí phát triển nhóm mới và các khoản hợp tác dài hạn.</p>' +
      '</div></div>' + resultShell() + '</div>';
  }

  function psmUpdate() {
    var basic = num("psm-title");
    var b = C.psmBasic({ basic: basic, target: num("psm-target"), actual: num("psm-actual") });
    var p = C.psmProductivity({ fyp: num("psm-actual"), fycRate: num("psm-rate"), target: num("psm-target"), p13: val("psm-p13"), indirect: checked("psm-indirect") });
    var q = C.psmQuarterly({ fycQuarter: num("psm-actual") * num("psm-rate") / 100 * 3, aaTarget: num("psm-aat"), aaActual: num("psm-aaa"), p13: val("psm-p13"), indirect: checked("psm-indirect") });
    var month = b.total + p.total;
    setResult(big("Thu nhập tháng", fmt(month), "triệu đồng", b.ok ? "Tỷ lệ hoàn thành chỉ tiêu " + pct(b.attainment, 1) + ", phí cơ bản đạt " + pct(b.factor, 1) + " mức cơ bản." : "Dưới 30% chỉ tiêu FYP: không hưởng phí cơ bản.", rows([
      ["Phí cơ bản", fmt(b.total) + " tr"],
      ["Phí năng suất tháng", fmt(p.total) + " tr"],
      ["Tổng tháng", fmt(month) + " tr"],
      ["Phí hoạt động quý", fmt(q.total) + " tr"],
      ["Tổng quý (3 tháng + quý)", fmt(month * 3 + q.total) + " tr"]
    ])));
  }

  function mountPsm() {
    var root = document.getElementById("toolRoot");
    root.addEventListener("input", psmUpdate);
    root.addEventListener("change", psmUpdate);
    psmUpdate();
  }

  /* ------------------------------------------------------------- title check */

  var TITLE_NAMES = { none: "Chưa đạt", bac: "Bạc", vang: "Vàng", bachkim: "Bạch Kim" };
  var MBA_NAMES = { none: "Chưa đạt", bac: "Bạc", vang: "Vàng", bachkim: "Bạch Kim" };

  function titleHtml() {
    return '<div class="tool" id="toolRoot">' +
      '<div class="tool__form">' +
        '<div class="tabs" role="tablist">' +
          '<button class="tab is-active" data-tab="pro" role="tab">Manulife Pro</button>' +
          '<button class="tab" data-tab="mba" role="tab">MBA Pro</button>' +
        '</div>' +
        '<div class="formbody">' +
          '<section data-panel="pro">' +
            '<div class="formgrid">' +
              field("tc-months", "Số tháng làm việc", 13, "Từ 12 tháng trở xuống dùng mức Vàng thấp hơn.") +
              field("tc-cc", "Số hợp đồng trong 12 tháng", 15) +
              field("tc-fyp", "FYP trong 12 tháng (triệu)", 360) +
              field("tc-active", "Số tháng có hoạt động", 6, "1 hợp đồng và 4 triệu FYC mỗi tháng.") +
              field("tc-p13", "Tỷ lệ P13 (%)", 70, "Để trống nếu chưa có.") +
            '</div>' +
            check("tc-new", "Đại lý mới trong giai đoạn M0-M2", false) +
            check("tc-new-cond", "Đại lý mới đã hoàn thành SBW và 4 buổi chuyên cần mỗi tháng", true) +
          '</section>' +
          '<section data-panel="mba" hidden>' +
            '<div class="formgrid">' +
              field("mb-high", "Đại lý tuyển mới đạt 3 hợp đồng và 40 triệu FYP", 3, "Đường chất lượng.") +
              field("mb-low", "Đại lý tuyển mới đạt 1 hợp đồng và 16 triệu FYP", 0, "Đường số lượng.") +
              field("mb-fyc", "Tổng FYC năm sau luật 50 (triệu)", 250) +
              field("mb-um", "Số UM mới báo cáo trực tiếp", 1) +
              field("mb-p13", "Tỷ lệ P13 (%)", 70) +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>' + resultShell() + '</div>';
  }

  function proGap(r) {
    var target = r.next;
    if (!target) return [];
    var req = target === "bachkim"
      ? { cc: 24, fyp: 600, active: 6, p13: 70 }
      : target === "vang"
        ? (r.months > 12 ? { cc: 15, fyp: 360, active: 6, p13: 70 } : { cc: 10, fyp: 240, active: 6, p13: 70 })
        : (r.months <= 2 && r.isNew ? { cc: 3, fyp: 40, active: 0, p13: 0 } : { cc: 5, fyp: 100, active: 3, p13: 70 });
    return [
      ["Hợp đồng còn thiếu", Math.max(0, req.cc - r.cc) + " hợp đồng"],
      ["FYP còn thiếu", fmt(Math.max(0, req.fyp - r.fyp)) + " triệu"],
      ["Tháng hoạt động còn thiếu", Math.max(0, req.active - r.active) + " tháng"],
      ["P13 cần đạt", req.p13 ? "từ " + req.p13 + "%" : "không xét"]
    ];
  }

  function titleUpdate() {
    var active = document.querySelector('#toolRoot .tab.is-active').getAttribute("data-tab");
    if (active === "pro") {
      var r = C.manulifePro({ months: num("tc-months"), cc: num("tc-cc"), fyp: num("tc-fyp"), activeMonths: num("tc-active"), p13: val("tc-p13"), isNew: checked("tc-new"), newConditions: checked("tc-new-cond") });
      var gap = r.next ? proGap(r) : [];
      setResult(big("Danh hiệu Manulife Pro", TITLE_NAMES[r.best], "hạng cao nhất đạt được", r.best === "none" ? "Chưa đạt hạng nào. Xem khoảng thiếu bên dưới." : (r.next ? "Còn thiếu để lên " + TITLE_NAMES[r.next] + "." : "Đã đạt hạng cao nhất."), gap.length ? rows(gap) : rows([["Trạng thái", "Đã đạt Bạch Kim"]])));
    } else {
      var m = C.mbaPro({ recruitHigh: num("mb-high"), recruitLow: num("mb-low"), fyc: num("mb-fyc"), newUm: num("mb-um"), p13: num("mb-p13") });
      var req = m.next === "bac" ? { high: 3, low: 8, fyc: 250, um: 1, p13: 70 } : m.next === "vang" ? { high: 4, low: 10, fyc: 350, um: 1, p13: 75 } : m.next === "bachkim" ? { high: 5, low: 12, fyc: 500, um: 1, p13: 75 } : null;
      var gap2 = [];
      if (req) {
        gap2 = [
          ["Tuyển mới đường chất lượng", Math.max(0, req.high - num("mb-high")) + " người"],
          ["Hoặc tuyển mới đường số lượng", Math.max(0, req.low - num("mb-low")) + " người"],
          ["FYC còn thiếu", fmt(Math.max(0, req.fyc - num("mb-fyc"))) + " triệu"],
          ["UM mới còn thiếu", Math.max(0, req.um - num("mb-um")) + " người"],
          ["P13 cần đạt", "từ " + req.p13 + "%"]
        ];
      }
      setResult(big("Danh hiệu MBA Pro", MBA_NAMES[m.best], "hạng cao nhất đạt được", m.best === "none" ? "Chưa đạt hạng nào. Xem khoảng thiếu bên dưới." : (m.next ? "Còn thiếu để lên " + MBA_NAMES[m.next] + "." : "Đã đạt hạng cao nhất."), gap2.length ? rows(gap2) : rows([["Trạng thái", "Đã đạt Bạch Kim"]])));
    }
  }

  function mountTitle() {
    var root = document.getElementById("toolRoot");
    root.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        root.querySelectorAll(".tab").forEach(function (b) { b.classList.remove("is-active"); });
        root.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = true; });
        btn.classList.add("is-active");
        root.querySelector('[data-panel="' + btn.getAttribute("data-tab") + '"]').hidden = false;
        titleUpdate();
      });
    });
    root.addEventListener("input", titleUpdate);
    root.addEventListener("change", titleUpdate);
    titleUpdate();
  }

  /* ------------------------------------------------------------- P13 */

  function p13Html() {
    return '<div class="tool" id="toolRoot">' +
      '<div class="tool__form"><div class="formbody">' +
        '<div class="formgrid">' +
          field("p13-due", "Tổng phí quy năm phải thu năm 2 (triệu)", 171) +
          field("p13-collected", "Tổng phí quy năm đã thu năm 2 (triệu)", 96) +
        '</div>' +
        '<p class="assume">P13 dùng phí quy năm, không dùng FYP hay FYC. Với P13 cuộn, nhập tổng của các hợp đồng trong giai đoạn đo 27 tháng.</p>' +
      '</div></div>' + resultShell() + '</div>';
  }

  function p13Update() {
    var r = C.p13calc({ due: num("p13-due"), collected: num("p13-collected") });
    var next = r.pct < 50 ? 50 : r.pct < 60 ? 60 : r.pct < 65 ? 65 : r.pct < 70 ? 70 : null;
    var gap = next ? (next / 100 * num("p13-due") - num("p13-collected")) : 0;
    setResult(big("Tỷ lệ P13", fmt(r.pct, 2) + "%", "tỷ lệ duy trì hợp đồng năm 2", "Hệ số nhân áp dụng cho khoản thưởng: " + pct(r.multiplier, 0) + ".", rows([
      ["Phí phải thu", fmt(num("p13-due")) + " tr"],
      ["Phí đã thu", fmt(num("p13-collected")) + " tr"],
      ["Hệ số thưởng", pct(r.multiplier, 0)],
      [next ? "Cần thêm để đạt " + next + "%" : "Ngưỡng tiếp theo", next ? fmt(Math.max(0, gap)) + " tr" : "Đã đạt mức tối đa 100%"]
    ])));
  }

  function mountP13() {
    var root = document.getElementById("toolRoot");
    root.addEventListener("input", p13Update);
    root.addEventListener("change", p13Update);
    p13Update();
  }

  /* ------------------------------------------------------------- registry */

  var TOOLS = [
    {
      id: "fa-income",
      title: "Máy tính thu nhập FA",
      short: "Sáu khoản thưởng của đại lý",
      desc: "Sáu nhóm thưởng chính của đại lý, tính theo FYC, FYP, P13 và kỷ luật.",
      icon: "wallet",
      tags: ["FA", "thưởng", "P13"],
      html: faHtml,
      mount: mountFa
    },
    {
      id: "um-fees",
      title: "Máy tính phí dịch vụ UM",
      short: "Năng suất nhóm, hoạt động nhóm, phát triển đại lý mới",
      desc: "Ước tính thu nhập tháng của quản lý đại lý từ cơ cấu đội và P13.",
      icon: "users",
      tags: ["UM", "phí dịch vụ", "MBA Pro"],
      html: umHtml,
      mount: mountUm
    },
    {
      id: "psm-fees",
      title: "Máy tính thu nhập PSM+",
      short: "Phí cơ bản, năng suất tháng, hoạt động quý",
      desc: "Tính thu nhập tháng của PSM+ hoặc HKD theo chỉ tiêu FYP và 1mAA_4mFYC.",
      icon: "chart",
      tags: ["PSM+", "HKD", "phí dịch vụ"],
      html: psmHtml,
      mount: mountPsm
    },
    {
      id: "title-check",
      title: "Kiểm tra danh hiệu",
      short: "Manulife Pro và MBA Pro",
      desc: "Nhập số liệu hiện tại, xem hạng đạt được và khoảng thiếu đến hạng kế tiếp.",
      icon: "award",
      tags: ["Manulife Pro", "MBA Pro", "danh hiệu"],
      html: titleHtml,
      mount: mountTitle
    },
    {
      id: "p13",
      title: "Máy tính P13",
      short: "Tỷ lệ duy trì và hệ số thưởng",
      desc: "Tính P13 từ phí phải thu và phí đã thu, kèm hệ số nhân và ngưỡng tiếp theo.",
      icon: "target",
      tags: ["P13", "TLDTHD", "duy trì"],
      html: p13Html,
      mount: mountP13
    }
  ];

  window.TOOLS = TOOLS;
  window.TOOL_NAMES = {};
  TOOLS.forEach(function (t) { window.TOOL_NAMES[t.id] = t.title; });
  window.getTool = function (id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; };
})();
