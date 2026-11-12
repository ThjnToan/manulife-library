/* Pure policy calculators. No DOM. Works in the browser and in Node tests. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Calc = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var M = 1000000;

  function n(v) {
    var x = typeof v === "number" ? v : parseFloat(String(v == null ? "" : v).replace(/\s/g, "").replace(/,/g, "."));
    return isFinite(x) ? x : 0;
  }

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  function p13Mult(p13) {
    if (p13 === null || p13 === undefined || p13 === "") return 1;
    var p = n(p13);
    if (p >= 70) return 1;
    if (p >= 65) return 0.9;
    if (p >= 60) return 0.7;
    if (p >= 50) return 0.5;
    if (p > 0) return p / 200; // P13 thực đạt / 2
    return 0;
  }

  function p13MultNewAgent(p13) {
    if (p13 === null || p13 === undefined || p13 === "") return 1;
    var p = n(p13);
    if (p >= 80) return 1.1;
    if (p >= 75) return 1.05;
    if (p >= 70) return 1;
    if (p >= 65) return 0.9;
    if (p >= 60) return 0.7;
    if (p >= 50) return 0.5;
    if (p > 0) return p / 200;
    return 0;
  }

  function p13MultUm(p13) {
    if (p13 === null || p13 === undefined || p13 === "") return 1;
    var p = n(p13);
    if (p >= 80) return 1.1;
    if (p >= 75) return 1.05;
    if (p >= 70) return 1;
    if (p >= 65) return 0.9;
    if (p >= 60) return 0.7;
    if (p >= 50) return 0.5;
    if (p > 0) return p / 200;
    return 0;
  }

  function clkdMult(level) {
    if (level === "reminder") return 0.5;
    if (level === "warning" || level === "termination") return 0;
    return 1;
  }

  var MONTHLY_TIERS = [
    { no: 8, min: 100, rate: 0.50, expOnly: true },
    { no: 7, min: 80, rate: 0.35 },
    { no: 6, min: 60, rate: 0.30 },
    { no: 5, min: 45, rate: 0.25 },
    { no: 4, min: 30, rate: 0.20 },
    { no: 3, min: 15, rate: 0.15 },
    { no: 2, min: 10, rate: 0.10 },
    { no: 1, min: 5, rate: 0.05, newOnly: true }
  ];

  function monthlyProductivity(o) {
    o = o || {};
    var months = n(o.months), fyc3 = n(o.fyc3), fycMonth = n(o.fycMonth), cc = n(o.cc);
    var pm = p13Mult(o.p13), cm = clkdMult(o.discipline);
    var eligible = months <= 6
      ? MONTHLY_TIERS.filter(function (t) { return !t.expOnly; })
      : MONTHLY_TIERS.filter(function (t) { return !t.newOnly; });
    var tier = null;
    for (var i = 0; i < eligible.length; i++) {
      if (fyc3 >= eligible[i].min) { tier = eligible[i]; break; }
    }
    var hasCC = cc >= 1 && fycMonth > 0;
    var base = tier && hasCC ? fycMonth * tier.rate : 0;
    return {
      tier: tier ? tier.no : 0,
      rate: tier ? tier.rate : 0,
      fyc3: fyc3,
      fycMonth: fycMonth,
      base: base,
      p13Mult: pm,
      clkdMult: cm,
      total: base * pm * cm,
      eligible: hasCC
    };
  }

  var QUARTER_TIERS = [
    { no: 7, min: 120, normal: 0.10, excellent: 0.20 },
    { no: 6, min: 100, normal: 0.08, excellent: 0.16 },
    { no: 5, min: 80, normal: 0.06, excellent: 0.12 },
    { no: 4, min: 60, normal: 0.05, excellent: 0.10 },
    { no: 3, min: 45, normal: 0.04, excellent: 0.08 },
    { no: 2, min: 30, normal: 0.03, excellent: 0.06 },
    { no: 1, min: 15, normal: 0.02, excellent: 0.04, newOnly: true }
  ];

  function quarterly(o) {
    o = o || {};
    var fyc = n(o.fycQuarter), months = n(o.months), excellent = !!o.excellent;
    var pm = p13Mult(o.p13), cm = clkdMult(o.discipline);
    var tiers = months <= 6 ? QUARTER_TIERS : QUARTER_TIERS.filter(function (t) { return !t.newOnly; });
    var tier = null;
    for (var i = 0; i < tiers.length; i++) {
      if (fyc >= tiers[i].min) { tier = tiers[i]; break; }
    }
    var rate = tier ? (excellent ? tier.excellent : tier.normal) : 0;
    var base = fyc * rate;
    return { tier: tier ? tier.no : 0, rate: rate, base: base, p13Mult: pm, clkdMult: cm, total: base * pm * cm };
  }

  function newAgent(o) {
    o = o || {};
    var m1 = o.m1 || {}, m2 = o.m2 || {};
    var pm = p13Mult(o.p13), cm = clkdMult(o.discipline);
    var sbw1 = !!m1.sbw, sbw2 = sbw1 || !!m2.sbw;
    function one(m, sbw) {
      var fyp = n(m.fyp), cc = n(m.cc), att = n(m.attendance);
      if (fyp < 10 || cc < 1) return { base: 0, full: false, reason: "Không đạt sản xuất" };
      var full = att >= 4 && sbw;
      return { base: full ? 1.5 : 0.75, full: full, reason: full ? "Đủ điều kiện" : "Chỉ đạt sản xuất" };
    }
    var a = one(m1, sbw1), b = one(m2, sbw2);
    var totalFyp = n(m1.fyp) + n(m2.fyp);
    var totalCC = n(m1.cc) + n(m2.cc);
    var excellent = totalFyp >= 40 && totalCC >= 3 && n(m1.attendance) >= 4 && n(m2.attendance) >= 4 && (sbw1 || sbw2);
    var monthlyTotal = a.base + b.base;
    var excellentBase = excellent ? 5 : 0;
    var base = monthlyTotal + excellentBase;
    return { m1: a, m2: b, excellent: excellent, monthlyTotal: monthlyTotal, excellentBase: excellentBase, base: base, p13Mult: pm, clkdMult: cm, total: base * pm * cm };
  }

  var MSTAR_TARGETS = [60, 430, 750, 1073.6452];
  var MSTAR_REWARDS = [
    { low: 5, full: 8 },
    { low: 8, full: 12 },
    { low: 10, full: 15 },
    { low: 0, full: 20 }
  ];

  function mstar(o) {
    o = o || {};
    var q = clamp(Math.round(n(o.quarter) || 1), 1, 4);
    var cum = n(o.cumFyp), active = !!o.activeAll;
    var pm = p13Mult(o.p13), cm = clkdMult(o.discipline);
    var target = MSTAR_TARGETS[q - 1];
    var ratio = target ? cum / target : 0;
    var reward = 0, band = "Chưa đạt";
    if (active) {
      if (ratio >= 1) { reward = MSTAR_REWARDS[q - 1].full; band = "Từ 100%"; }
      else if (ratio >= 0.9 && q < 4) { reward = MSTAR_REWARDS[q - 1].low; band = "90% đến dưới 100%"; }
    }
    return { quarter: q, target: target, ratio: ratio, band: band, base: reward, p13Mult: pm, clkdMult: cm, total: reward * pm * cm, active: active };
  }

  function mstarAnnual(o) {
    o = o || {};
    var fyp = n(o.annualFyp), received = n(o.quartersReceived);
    var target = fyp >= 3000 ? 100 : fyp >= 2000 ? 75 : fyp >= 1073.6452 ? 55 : 0;
    var pm = p13Mult(o.p13), cm = clkdMult(o.discipline);
    var gross = target * pm * cm;
    return { target: target, gross: gross, received: received, net: Math.max(0, gross - received) };
  }

  var PRO_MONTHLY = [
    { min: 120, bac: 0, vang: 0, bachkim: 20, mdrt: true },
    { min: 100, bac: 0, vang: 0, bachkim: 16 },
    { min: 80, bac: 0, vang: 0, bachkim: 12 },
    { min: 60, bac: 0, vang: 7, bachkim: 10 },
    { min: 45, bac: 0, vang: 5, bachkim: 8 },
    { min: 30, bac: 3, vang: 3, bachkim: 4 },
    { min: 15, bac: 1.5, vang: 1.5, bachkim: 2 }
  ];

  function proMonthly(o) {
    o = o || {};
    var fyp = n(o.fyp), title = o.title || "bac", mdrt = !!o.mdrt;
    var tier = null;
    for (var i = 0; i < PRO_MONTHLY.length; i++) {
      var t = PRO_MONTHLY[i];
      if (fyp < t.min) continue;
      if (t.mdrt && !mdrt) continue;
      tier = t;
      break;
    }
    var amount = tier ? (tier[title] || 0) : 0;
    var pm = p13Mult(o.p13), cm = clkdMult(o.discipline);
    return { tier: tier ? tier.min : 0, base: amount, p13Mult: pm, clkdMult: cm, total: amount * pm * cm };
  }

  function annualExcellence(o) {
    o = o || {};
    var title = o.title || "vang", cc = n(o.cc), fyp = n(o.fyp), p13 = n(o.p13);
    var fyc = n(o.fycYear), months = n(o.months);
    var req = null;
    if (title === "bachkim") req = { cc: 24, fyp: 600, p13: 70, rate: 0.15 };
    else if (title === "vang") req = months > 12
      ? { cc: 15, fyp: 360, p13: 70, rate: 0.10 }
      : { cc: 10, fyp: 240, p13: 70, rate: 0.10 };
    var eligible = !!req && cc >= req.cc && fyp >= req.fyp && p13 >= req.p13;
    var base = eligible ? Math.min(100, fyc * req.rate) : 0;
    var cm = clkdMult(o.discipline);
    var total = base * cm;
    return { eligible: eligible, base: base, total: total, y1: total * 0.5, y2: total * 0.3, y3: total * 0.2, req: req };
  }

  function umProductivity(o) {
    o = o || {};
    var f1 = n(o.fyc1), f2 = n(o.fyc2), f3 = n(o.fyc3), f4 = n(o.fyc4);
    function rateFor(fyc) {
      if (fyc >= 48) return 0.20;
      if (fyc >= 24) return 0.16;
      if (fyc >= 7) return 0.14;
      return 0.10;
    }
    var r1 = rateFor(f1), r2 = rateFor(f2) / 2, r3 = rateFor(f3) / 4, r4 = rateFor(f4) / 8;
    var v1 = f1 * r1, v2 = f2 * r2, v3 = f3 * r3, v4 = f4 * r4;
    return { rates: [r1, r2, r3, r4], values: [v1, v2, v3, v4], total: v1 + v2 + v3 + v4 };
  }

  function umActivity(o) {
    o = o || {};
    var count = n(o.producing), mba = !!o.mbaPro, pool = n(o.bonusPool), att = n(o.attendance);
    var pm = p13MultUm(o.p13);
    var rate = 0;
    if (count >= 6) rate = mba ? 1.25 : 0.60;
    else if (count >= 4) rate = mba ? 1.00 : 0.50;
    else if (count >= 2) rate = mba ? 0.75 : 0.40;
    else if (count >= 1) rate = 0.30;
    var base = pool * rate;
    var total = att >= 4 ? base * pm : 0;
    return { rate: rate, base: base, p13Mult: pm, total: total, attendanceOk: att >= 4 };
  }

  function umNewAgentFee(o) {
    o = o || {};
    var base = n(o.newAgentBonuses), mba = !!o.mbaPro;
    var pm = p13MultUm(o.p13);
    var rate = mba ? 1 : 0.5;
    return { rate: rate, base: base, p13Mult: pm, total: base * rate * pm };
  }

  function umNewGroupFee(o) {
    o = o || {};
    var umFee = n(o.umProductivityFee);
    var raw = umFee * 2.1;
    var total = Math.min(raw, 30);
    return { raw: raw, total: total, immediate: total * 0.5, month7: total * 0.5 * 0.4, month15: total * 0.5 * 0.6 };
  }

  function umLongTerm(o) {
    o = o || {};
    var activity = n(o.annualActivity), newAgent = n(o.annualNewAgent);
    var title = o.title || "bac";
    var rate = title === "bachkim" ? 1.25 : title === "vang" ? 1 : 0.8;
    var total = (activity + newAgent) * rate;
    return { rate: rate, base: activity + newAgent, total: total, y1: total * 0.3, y2: total * 0.3, y3: total * 0.4 };
  }

  function psmBasic(o) {
    o = o || {};
    var basic = n(o.basic), target = n(o.target), actual = n(o.actual);
    if (target <= 0) return { attainment: 0, factor: 0, total: 0, ok: false };
    var att = actual / target;
    if (att < 0.3) return { attainment: att, factor: 0, total: 0, ok: false };
    var factor = Math.min(1.5, att * 1.3);
    return { attainment: att, factor: factor, total: basic * factor, ok: true };
  }

  function psmProductivity(o) {
    o = o || {};
    var fyp = n(o.fyp), fycRate = n(o.fycRate), target = n(o.target);
    var att = target > 0 ? fyp / target : 0;
    var rate = att >= 1.15 ? 0.08 : 0.06;
    var fyc = fyp * fycRate / 100;
    var pm = p13MultUm(o.p13);
    var total = fyc * rate * pm;
    if (o.indirect) total *= 0.5;
    return { attainment: att, rate: rate, fyc: fyc, p13Mult: pm, total: total };
  }

  function psmQuarterly(o) {
    o = o || {};
    var fyc = n(o.fycQuarter), target = n(o.aaTarget), actual = n(o.aaActual);
    var att = target > 0 ? actual / target : 0;
    var rate = att >= 1.2 ? 0.05 : att >= 1.1 ? 0.035 : att >= 1.0 ? 0.025 : att >= 0.9 ? 0.01 : 0;
    var pm = p13MultUm(o.p13);
    var total = fyc * rate * pm;
    if (o.indirect) total *= 0.5;
    return { attainment: att, rate: rate, p13Mult: pm, total: total };
  }

  function psmLongTerm(o) {
    o = o || {};
    var direct = n(o.directFees), indirect = n(o.indirectFees), basic = n(o.basic);
    var total = direct * 0.75 + indirect * 0.25;
    var cap = basic * 12;
    var capped = Math.min(total, cap);
    return { raw: total, cap: cap, total: capped, y1: capped * 0.3, y2: capped * 0.3, y3: capped * 0.4 };
  }

  function p13ok(p13) { return p13 === null || p13 === undefined || p13 === "" || n(p13) >= 70; }

  function manulifePro(o) {
    o = o || {};
    var cc = n(o.cc), fyp = n(o.fyp), active = n(o.activeMonths), months = n(o.months), isNew = !!o.isNew;
    var ok13 = p13ok(o.p13);
    var tiers = [];
    if (cc >= 24 && fyp >= 600 && active >= 6 && ok13) tiers.push("bachkim");
    if (months > 12) {
      if (cc >= 15 && fyp >= 360 && active >= 6 && ok13) tiers.push("vang");
    } else {
      if (cc >= 10 && fyp >= 240 && active >= 6 && ok13) tiers.push("vang");
    }
    if (isNew) {
      if (cc >= 3 && fyp >= 40 && o.newConditions !== false) tiers.push("bac");
    } else {
      if ((cc >= 5 && fyp >= 100 && active >= 3 && ok13) || (cc >= 3 && fyp >= 40 && active >= 2 && ok13)) tiers.push("bac");
    }
    var best = tiers.indexOf("bachkim") >= 0 ? "bachkim" : tiers.indexOf("vang") >= 0 ? "vang" : tiers.indexOf("bac") >= 0 ? "bac" : "none";
    var next = best === "none" ? "bac" : best === "bac" ? "vang" : best === "vang" ? "bachkim" : null;
    return { best: best, next: next, ok13: ok13, cc: cc, fyp: fyp, active: active, months: months, isNew: isNew };
  }

  var MBA = {
    bac: { high: 3, low: 8, fyc: 250, um: 1, p13: 70 },
    vang: { high: 4, low: 10, fyc: 350, um: 1, p13: 75 },
    bachkim: { high: 5, low: 12, fyc: 500, um: 1, p13: 75 }
  };

  function mbaPro(o) {
    o = o || {};
    var high = n(o.recruitHigh), low = n(o.recruitLow), fyc = n(o.fyc), um = n(o.newUm), p13 = n(o.p13);
    function ok(r) {
      return (high >= r.high || low >= r.low) && fyc >= r.fyc && um >= r.um && p13 >= r.p13;
    }
    var best = ok(MBA.bachkim) ? "bachkim" : ok(MBA.vang) ? "vang" : ok(MBA.bac) ? "bac" : "none";
    var next = best === "none" ? "bac" : best === "bac" ? "vang" : best === "vang" ? "bachkim" : null;
    return { best: best, next: next };
  }

  function p13calc(o) {
    o = o || {};
    var due = n(o.due), collected = n(o.collected);
    var ratio = due > 0 ? collected / due : 0;
    return { ratio: ratio, pct: ratio * 100, multiplier: p13Mult(ratio * 100) };
  }

  return {
    n: n,
    p13Mult: p13Mult,
    p13MultNewAgent: p13MultNewAgent,
    p13MultUm: p13MultUm,
    clkdMult: clkdMult,
    monthlyProductivity: monthlyProductivity,
    quarterly: quarterly,
    newAgent: newAgent,
    mstar: mstar,
    mstarAnnual: mstarAnnual,
    proMonthly: proMonthly,
    annualExcellence: annualExcellence,
    umProductivity: umProductivity,
    umActivity: umActivity,
    umNewAgentFee: umNewAgentFee,
    umNewGroupFee: umNewGroupFee,
    umLongTerm: umLongTerm,
    psmBasic: psmBasic,
    psmProductivity: psmProductivity,
    psmQuarterly: psmQuarterly,
    psmLongTerm: psmLongTerm,
    manulifePro: manulifePro,
    mbaPro: mbaPro,
    p13calc: p13calc
  };
});
