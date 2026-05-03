// ============================================================
//  shared.js — Sharada Diagnostics Boards
//  Navigation, login, chart helpers — imported by every board
// ============================================================

// ── Config ───────────────────────────────────────────────────
const CFG = {
  lab: { name: "Sharada Diagnostics", tagline: "Precision · Speed · Care" },
  pins: { owner: "1234", reception: "5678", pathologist: "9012" },
  targets: { patientsPerDay: 55, monthlyRevenue: 850000, reportTAT: 4 },
  costs: { salaries: 115000, rent: 40000, emi: 38000, electricity: 18000, marketing: 25000, tech: 5299 },
  // ── When connected to Supabase, set these ──
  data: { mode: "demo" }, // "demo" | "supabase"
  supabase: { url: "", anonKey: "" },
};

// ── Boards manifest ─────────────────────────────────────────
const BOARDS = [
  { id: "patient",  file: "patient.html",  label: "Patient board",  icon: "person", roles: ["owner","reception"] },
  { id: "revenue",  file: "revenue.html",  label: "Revenue board",  icon: "chart",  roles: ["owner"] },
  { id: "reports",  file: "reports.html",  label: "Reports board",  icon: "doc",    roles: ["owner","reception","pathologist"] },
  { id: "reagent",  file: "reagent.html",  label: "Reagent board",  icon: "flask",  roles: ["owner"] },
  { id: "doctors",  file: "doctors.html",  label: "Doctor board",   icon: "steth",  roles: ["owner"] },
  { id: "staff",    file: "staff.html",    label: "Staff board",    icon: "table",  roles: ["owner"] },
];

const ICONS = {
  person:`<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  chart: `<svg viewBox="0 0 16 16" fill="none"><path d="M2 12l3-4 3 2 3-5 3 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  doc:   `<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="10" height="13" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  flask: `<svg viewBox="0 0 16 16" fill="none"><path d="M6 1v5L2 13a1 1 0 00.9 1.5h10.2A1 1 0 0014 13L10 6V1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M5.5 1h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  steth: `<svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M1 14c0-2.8 2.2-5 5-5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M11 9v6M8 12h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  table: `<svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M1 6h14M6 6v9" stroke="currentColor" stroke-width="1.3"/></svg>`,
};

const LOGO_SVG = `<svg width="52" height="52" viewBox="0 0 72 72" fill="none" style="margin:0 auto 14px;display:block">
  <g opacity=".13"><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(45 36 36)"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(90 36 36)"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(135 36 36)"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(180 36 36)"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(225 36 36)"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(270 36 36)"/><path d="M36,8 C40,16 40,26 36,28 C32,26 32,16 36,8" fill="#C98420" transform="rotate(315 36 36)"/></g>
  <circle cx="36" cy="36" r="33" stroke="#0A5548" stroke-width=".7" fill="none"/>
  <circle cx="36" cy="36" r="29.5" stroke="#0A5548" stroke-width=".4" fill="none"/>
  <path d="M 44,24 A 8,8 0 0,0 28,24 C 28,36 44,36 44,48 A 8,8 0 0,1 28,48" stroke="#0A5548" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <circle cx="44" cy="24" r="2.6" fill="#C98420"/><circle cx="28" cy="48" r="2.6" fill="#C98420"/>
</svg>`;

// ── State ────────────────────────────────────────────────────
const STATE = {
  role: sessionStorage.getItem("sd_role") || null,
  pin: "",
  charts: {},
};

// ── Helpers ──────────────────────────────────────────────────
const R  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const f  = n => "₹" + Math.round(n).toLocaleString("en-IN");
const fK = n => n >= 100000 ? "₹" + (n/100000).toFixed(1) + "L" : n >= 1000 ? "₹" + (n/1000).toFixed(0) + "K" : f(n);
const pct = (a, b) => b ? ((a - b) / b * 100).toFixed(1) : 0;
const today = () => new Date().toISOString().split("T")[0];

const NAMES = ["Ravi Kumar","Anitha Devi","Suresh Rao","Priya Singh","Venkata Reddy","Meena Bai","Kiran Kumar","Lakshmi Devi","Arjun Sharma","Sunita Patel","Ramesh Gupta","Nandini Rao","Vikram Singh","Deepa Nair","Srinivas Reddy","Madhavi Latha","Rajesh Sharma","Usha Rani","Ganesh Rao","Padmaja Devi"];
const TESTS = ["CBC","TSH","Vitamin D","Lipid Profile","HbA1c","Blood Sugar","LFT","RFT","Urine Routine","ECG","USG Abdomen","X-Ray Chest","Dengue NS1","Thyroid Profile","Serum Creatinine"];
const DOCS  = ["Dr Priya Reddy","Dr Ravi Shankar","Dr Suresh Nair","Dr Anitha Rao","Dr Kiran Mehta","Dr Meena Lakshmi","Walk-in"];

// ── Chart helpers ─────────────────────────────────────────────
function mkChart(id, type, data, opts = {}) {
  if (STATE.charts[id]) { try { STATE.charts[id].destroy(); } catch(e){} }
  const c = document.getElementById(id); if (!c) return;
  STATE.charts[id] = new Chart(c.getContext("2d"), {
    type, data,
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: opts.legend || { display: false }, tooltip: { callbacks: { label: opts.ttFn || undefined } } },
      scales: opts.noScales ? {} : {
        x: {
          title: { display: !!opts.xLabel, text: opts.xLabel||"", font:{size:10}, color:"#7A7464" },
          grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0 }
        },
        y: {
          title: { display: !!opts.yLabel, text: opts.yLabel||"", font:{size:10}, color:"#7A7464" },
          grid: { color: "rgba(128,128,128,.07)" }, ticks: { font: { size: 10 }, callback: opts.yFmt || undefined }, min: opts.yMin, max: opts.yMax
        }
      }
    }
  });
}

function barChart(id, labels, data, color = "#0A5548", opts = {}) {
  mkChart(id, "bar", { labels, datasets: [{ data, backgroundColor: color + "22", borderColor: color, borderWidth: 1.5, borderRadius: 3 }] }, opts);
}

function lineChart(id, labels, datasets, opts = {}) {
  mkChart(id, "line", { labels, datasets: datasets.map(d => ({ borderWidth: 2, pointRadius: 2.5, tension: .4, ...d })) }, {
    legend: { display: datasets.length > 1, labels: { font: { size: 10 }, boxWidth: 8, padding: 6 } }, ...opts
  });
}

function doughnut(id, labels, data, colors, opts = {}) {
  mkChart(id, "doughnut", { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] }, { noScales: true, legend: { display: true, position: "right", labels: { font: { size: 10 }, boxWidth: 8, padding: 5 } }, ...opts });
}

// ── KPI card builder ─────────────────────────────────────────
function kpi(label, val, sub, trendClass, trendText, accentClass, opts = {}) {
  const prog = opts.prog != null ? `<div class="kprog"><div class="kprogf" style="width:${Math.min(opts.prog,100)}%;background:${opts.progColor||"var(--teal2)"}"></div></div>` : "";
  return `<div class="kc ${accentClass||""}">
    <div class="kl">${label}</div>
    <div class="kv" style="${opts.color ? "color:"+opts.color : ""}">${val}</div>
    <div class="ks">${sub}</div>
    <div class="kt ${trendClass}">${trendText}</div>
    ${prog}
  </div>`;
}

// ── Login ─────────────────────────────────────────────────────
function initLogin(currentBoardId) {
  STATE.role = "owner";
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "flex";
  buildNav(currentBoardId);
  startClock();
  return true;
}

function buildLoginUI(currentBoardId) {
  STATE.role = STATE.role || "owner";
  document.getElementById("login").innerHTML = `
    ${LOGO_SVG}
    <div class="lcard">
      <div class="lnm">Sharada</div>
      <div class="lsb">Operations Boards</div>
      <div class="lro">
        <button class="rb on" onclick="selRole('owner',this)">Owner</button>
        <button class="rb" onclick="selRole('reception',this)">Reception</button>
        <button class="rb" onclick="selRole('pathologist',this)">Pathologist</button>
      </div>
      <div class="lpd"><div class="dot" id="d0"></div><div class="dot" id="d1"></div><div class="dot" id="d2"></div><div class="dot" id="d3"></div></div>
      <div class="pgrid">
        <button class="pk" onclick="pk('1')">1</button><button class="pk" onclick="pk('2')">2</button><button class="pk" onclick="pk('3')">3</button>
        <button class="pk" onclick="pk('4')">4</button><button class="pk" onclick="pk('5')">5</button><button class="pk" onclick="pk('6')">6</button>
        <button class="pk" onclick="pk('7')">7</button><button class="pk" onclick="pk('8')">8</button><button class="pk" onclick="pk('9')">9</button>
        <button class="pk" style="font-size:13px" onclick="pc()">⌫</button><button class="pk" onclick="pk('0')">0</button>
        <button class="pk" style="font-size:12px" onclick="ps('${currentBoardId}')">→</button>
      </div>
      <div class="lerr" id="lerr"></div>
      <div class="lhint">Demo PIN: 1234 (any role)</div>
    </div>`;
}

function selRole(role, btn) {
  STATE.role = role;
  document.querySelectorAll(".rb").forEach(b => b.classList.remove("on"));
  btn.classList.add("on");
  STATE.pin = ""; updDots();
}

function updDots() {
  for (let i = 0; i < 4; i++) {
    const d = document.getElementById("d" + i);
    if (d) d.style.background = i < STATE.pin.length ? "var(--teal)" : "var(--brd)";
  }
}

function pk(k) { if (STATE.pin.length >= 4) return; STATE.pin += k; updDots(); if (STATE.pin.length === 4) setTimeout(() => ps(window._boardId), 120); }
function pc() { STATE.pin = STATE.pin.slice(0, -1); updDots(); }

function ps(boardId) {
  const board = BOARDS.find(b => b.id === boardId);
  const correctPin = CFG.pins[STATE.role];
  if (STATE.pin === correctPin || STATE.pin === "1234") {
    if (board && !board.roles.includes(STATE.role)) {
      document.getElementById("lerr").textContent = "Your role cannot access this board.";
      STATE.pin = ""; updDots(); return;
    }
    sessionStorage.setItem("sd_role", STATE.role);
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "flex";
    buildNav(boardId);
    startClock();
    if (window.initBoard) window.initBoard();
  } else {
    document.getElementById("lerr").textContent = "Incorrect PIN. Try 1234.";
    STATE.pin = ""; updDots();
  }
}

// ── Sidebar nav ───────────────────────────────────────────────
function buildNav(currentBoardId) {
  const nav = document.getElementById("snav");
  const role = STATE.role || "owner";
  const visible = BOARDS.filter(b => b.roles.includes(role));
  nav.innerHTML = `<div class="nsc">Boards</div>` +
    visible.map(b => `
      <a class="ni ${b.id === currentBoardId ? "on" : ""}" href="${window._navBase||""}${b.file}">
        ${ICONS[b.icon]}<span class="nib">${b.label}</span>
      </a>`).join("");
}

function logout() {
  sessionStorage.removeItem("sd_role");
  STATE.role = null;
  location.reload();
}

// ── Clock ─────────────────────────────────────────────────────
function startClock() {
  const tick = () => {
    const t = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const c = document.getElementById("clk"); if (c) c.textContent = t;
    const h = document.getElementById("htime"); if (h) h.textContent = t;
  };
  tick(); setInterval(tick, 1000);
}

// ── Shared HTML: sidebar shell ────────────────────────────────
function buildShell() {
  return `
  <div class="login" id="login" style="position:fixed;inset:0;background:var(--cream);display:flex;align-items:center;justify-content:center;z-index:100;"></div>
  <div id="app" style="display:none;flex:1;flex-direction:row;overflow:hidden;width:100%;">
    <aside class="sb">
      <div class="sbb"><div class="sbn"><span class="ld"></span>Sharada</div><div class="sbs">Boards</div></div>
      <nav class="sbv" id="snav"></nav>
      <div class="sbm"><div class="mc">● Demo data</div></div>
      <div class="sbf" id="clk">--:--:--</div>
    </aside>
    <div class="main" id="board-main"></div>
  </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    STATE.role = "owner";
    app.style.display = "flex";
    if (window._boardId) buildNav(window._boardId);
    startClock();
    if (window.innerWidth <= 768) initMobileNav();
  }
});

document.addEventListener("click", e => {
  if (!e.target.closest(".ms-wrap"))
    document.querySelectorAll(".ms-panel").forEach(p => p.style.display="none");
});

// ── Mobile sidebar ─────────────────────────────────────────────
function initMobileNav() {
  const app = document.getElementById("app");
  if (!app) return;

  // Dark overlay — tapping it closes the sidebar
  const ov = document.createElement("div");
  ov.className = "sb-overlay";
  ov.onclick = closeMobSidebar;
  document.body.appendChild(ov);

  // Hamburger button inside #app (position:absolute keeps it out of flex flow)
  const btn = document.createElement("button");
  btn.className = "mob-hbg";
  btn.setAttribute("aria-label", "Open menu");
  btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  btn.onclick = openMobSidebar;
  app.appendChild(btn);

  // Close sidebar when a nav link is tapped
  document.querySelector(".sb")?.addEventListener("click", e => {
    if (e.target.closest(".ni")) closeMobSidebar();
  });
}

function openMobSidebar() {
  document.querySelector(".sb")?.classList.add("mob-open");
  document.querySelector(".sb-overlay")?.classList.add("on");
}

function closeMobSidebar() {
  document.querySelector(".sb")?.classList.remove("mob-open");
  document.querySelector(".sb-overlay")?.classList.remove("on");
}

// ── Multi-select dropdowns ────────────────────────────────────
const _MS = {};

function _msHTML(id) {
  const s = _MS[id]; if (!s) return "";
  const count = s.selected.size;
  const lbl = count > 0
    ? `${s.placeholder} <span class="ms-cnt">${count}</span>`
    : s.placeholder;
  return `<div class="ms-wrap" id="msw-${id}">
    <button class="ms-btn${count>0?" factive":""}" onclick="toggleMS('${id}',event)">${lbl}<span class="ms-arr">▾</span></button>
    <div class="ms-panel" id="msp-${id}" style="display:none">
      ${s.options.map(o=>`<div class="ms-opt" onclick="toggleMSOpt('${id}','${o.v}')"><span class="ms-chk${s.selected.has(o.v)?" on":""}"></span>${o.l}</div>`).join("")}
      ${count>0?`<div class="ms-clr" onclick="clearMS('${id}')">Clear all</div>`:""}
    </div>
  </div>`;
}

function buildMultiSelect(id, placeholder, options, cb) {
  const opts = options.map(o => typeof o === "string" ? {v:o,l:o} : o);
  if (!_MS[id]) _MS[id] = { selected:new Set(), placeholder, options:opts, cb };
  else { _MS[id].placeholder=placeholder; _MS[id].options=opts; _MS[id].cb=cb; }
  return _msHTML(id);
}

function getMSVals(id) { return [...(_MS[id]?.selected || new Set())]; }

function toggleMS(id, e) {
  e?.stopPropagation();
  const panel = document.getElementById("msp-"+id);
  if (!panel) return;
  const isOpen = panel.style.display !== "none";
  document.querySelectorAll(".ms-panel").forEach(p => p.style.display="none");
  if (!isOpen) panel.style.display = "block";
}

function toggleMSOpt(id, value) {
  const s = _MS[id]; if (!s) return;
  if (s.selected.has(value)) s.selected.delete(value); else s.selected.add(value);
  const wrap = document.getElementById("msw-"+id);
  if (wrap) {
    const wasOpen = document.getElementById("msp-"+id)?.style.display !== "none";
    wrap.outerHTML = _msHTML(id);
    if (wasOpen) { const p=document.getElementById("msp-"+id); if(p) p.style.display="block"; }
  }
  if (window[s.cb]) window[s.cb]();
}

function clearMS(id) {
  const s = _MS[id]; if (!s) return;
  s.selected.clear();
  const wrap = document.getElementById("msw-"+id);
  if (wrap) wrap.outerHTML = _msHTML(id);
  if (window[s.cb]) window[s.cb]();
}

function clearMSBatch(ids) {
  ids.forEach(id => {
    if (_MS[id]) _MS[id].selected.clear();
    const w = document.getElementById("msw-"+id); if (w) w.outerHTML = _msHTML(id);
  });
}

// ── Date Slicer ───────────────────────────────────────────────
const DSLICE = { preset: "today", from: today(), to: today() };

function _sliceRange(preset) {
  const n = new Date(), iso = d => d.toISOString().split("T")[0];
  let fr = new Date(n), to = new Date(n);
  if (preset === "yesterday")      { fr.setDate(fr.getDate()-1); to.setDate(to.getDate()-1); }
  else if (preset === "7d")        { fr.setDate(fr.getDate()-6); }
  else if (preset === "30d")       { fr.setDate(fr.getDate()-29); }
  else if (preset === "month")     { fr.setDate(1); }
  else if (preset === "lastmonth") { fr = new Date(n.getFullYear(), n.getMonth()-1, 1); to = new Date(n.getFullYear(), n.getMonth(), 0); }
  return { from: iso(fr), to: iso(to) };
}

function slicerDays() {
  if (!DSLICE.from || !DSLICE.to) return 1;
  return Math.max(1, Math.round((new Date(DSLICE.to) - new Date(DSLICE.from)) / 86400000) + 1);
}

function slicerLabel() {
  const m = { today:"Today", yesterday:"Yesterday", "7d":"Last 7 days", "30d":"Last 30 days",
    month:"This month", lastmonth:"Last month" };
  return DSLICE.preset === "custom"
    ? (DSLICE.from === DSLICE.to ? DSLICE.from : `${DSLICE.from} – ${DSLICE.to}`)
    : (m[DSLICE.preset] || "Today");
}

function slicerChartLabels() {
  const d = slicerDays();
  if (d === 1)  return ["7 AM","8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM"];
  if (d <= 7)   return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].slice(0, d);
  if (d <= 31)  return Array.from({length:d}, (_,i) => String(i+1));
  return Array.from({length:Math.min(Math.ceil(d/7), 12)}, (_,i) => `W${i+1}`);
}

function buildSlicer(pfx, cb) {
  const P = [
    {k:"today",l:"Today"},{k:"yesterday",l:"Yesterday"},{k:"7d",l:"Last 7d"},
    {k:"30d",l:"Last 30d"},{k:"month",l:"This month"},{k:"lastmonth",l:"Last month"},{k:"custom",l:"Custom"}
  ];
  const btns = P.map(p =>
    `<button class="dsb${DSLICE.preset===p.k?" on":""}" onclick="setSlice('${p.k}','${pfx}','${cb}')">${p.l}</button>`
  ).join("");
  const datePart = DSLICE.preset === "custom"
    ? `<div class="drange"><input type="date" id="${pfx}-dfrom" value="${DSLICE.from}" max="${today()}" onchange="setSliceCustom('${pfx}','${cb}')"><span class="drsep">→</span><input type="date" id="${pfx}-dto" value="${DSLICE.to}" max="${today()}" onchange="setSliceCustom('${pfx}','${cb}')"></div>`
    : `<span class="drange-lbl">${DSLICE.from === DSLICE.to ? DSLICE.from : `${DSLICE.from} – ${DSLICE.to}`}</span>`;
  return `<div class="dslice">${btns}</div>${datePart}`;
}

function setSlice(preset, pfx, cb) {
  DSLICE.preset = preset;
  if (preset !== "custom") { const r = _sliceRange(preset); DSLICE.from = r.from; DSLICE.to = r.to; }
  else if (!DSLICE.from)   { DSLICE.from = today(); DSLICE.to = today(); }
  if (window[cb]) window[cb]();
}

function setSliceCustom(pfx, cb) {
  DSLICE.from = document.getElementById(pfx+"-dfrom")?.value || today();
  DSLICE.to   = document.getElementById(pfx+"-dto")?.value   || today();
  if (DSLICE.from > DSLICE.to) DSLICE.to = DSLICE.from;
  if (window[cb]) window[cb]();
}
