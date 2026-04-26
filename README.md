# Sharada Diagnostics — Operations Boards

Six standalone operations boards for Sharada Diagnostics, Kondapur, Hyderabad.

Each board is an independent HTML file. No framework. No build step. No server needed.

---

## Boards

| Board | File | Purpose |
|-------|------|---------|
| Hub | `index.html` | Landing page — links all boards |
| Patient | `boards/patient.html` | Live queue, pipeline, source breakdown |
| Revenue | `boards/revenue.html` | P&L, targets, payment split, cost structure |
| Reports | `boards/reports.html` | TAT tracking, pathologist queue, abnormal alerts |
| Reagent | `boards/reagent.html` | Stock levels, reorder alerts, supplier contacts |
| Doctor | `boards/doctors.html` | Referral leaderboard, trend alerts, visit priority |
| Staff | `boards/staff.html` | Attendance, performance, payroll |

---

## Run locally

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/sharada-diagnostics.git

# Open in VS Code
code sharada-diagnostics

# Install Live Server extension, then:
# Right-click index.html → Open with Live Server
```

Opens at `http://127.0.0.1:5500` — all boards work immediately with demo data.

---

## Configuration

All settings in one place: `shared/shared.js`

```js
const CFG = {
  lab: { name: "Sharada Diagnostics" },
  targets: { patientsPerDay: 55, monthlyRevenue: 850000 },
  costs: { salaries: 115000, rent: 40000, emi: 38000 ... }
};
```

---

## Connect live data

See `docs/CONNECT_SUPABASE.md` for how your developer connects PathLIMS → Supabase → boards.

---

## Deploy online

See `docs/DEPLOY.md` for GitHub Pages, Netlify and Vercel options. All free.

---

## Tech stack

- Plain HTML + CSS + JavaScript — no framework
- Chart.js 4.4 — charts (loaded from CDN)
- Google Fonts — Outfit, DM Mono, Cormorant Garamond (loaded from CDN)
- Supabase — database when connected (optional)

---

*Sharada Diagnostics · Kondapur, Hyderabad · sharadadiagnostics.in*
