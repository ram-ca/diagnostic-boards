# Sharada Diagnostics — Boards Setup Guide

## Run locally (30 seconds)

1. Open VS Code
2. File → Open Folder → select `sharada-diagnostics`
3. Install the **Live Server** extension (Extensions panel → search "Live Server")
4. Right-click `index.html` → **Open with Live Server**
5. Opens at `http://127.0.0.1:5500`

All 6 boards open directly — no login, no server needed.

---

## Folder structure

```
sharada-diagnostics/
│
├── index.html              ← Hub page — start here
│
├── boards/                 ← One file per board
│   ├── patient.html
│   ├── revenue.html
│   ├── reports.html
│   ├── reagent.html
│   ├── doctors.html
│   └── staff.html
│
├── shared/                 ← Shared by all boards
│   ├── shared.css          ← All styles
│   └── shared.js           ← Helpers, nav, chart functions, config
│
├── assets/                 ← Images, icons (empty for now)
│
├── docs/
│   ├── SETUP.md            ← This file
│   ├── CONNECT_SUPABASE.md ← How to connect live data
│   └── DEPLOY.md           ← How to put it online
│
├── .vscode/
│   ├── extensions.json     ← Recommended VS Code extensions
│   └── settings.json       ← Live Server + formatting config
│
└── .gitignore
```

---

## What each file does

| File | Purpose | Edit? |
|------|---------|-------|
| `shared/shared.js` | Config (lab name, targets, costs), chart helpers, navigation | **Yes — main config file** |
| `shared/shared.css` | All styles for every board | Only for design changes |
| `boards/*.html` | Individual board logic and layout | Only to add new features |
| `index.html` | Hub landing page | Only to add/remove boards |

---

## Change your lab name, targets, costs

Open `shared/shared.js` — find the `CFG` object at the top:

```js
const CFG = {
  lab: {
    name: "Sharada Diagnostics",   // ← your lab name
    tagline: "Precision · Speed · Care",
  },
  targets: {
    patientsPerDay: 55,            // ← daily target
    monthlyRevenue: 850000,        // ← ₹8.5L
    reportTAT: 4,                  // ← 4 hour TAT target
  },
  costs: {
    salaries:    115000,           // ← update monthly
    rent:         40000,
    emi:          38000,
    electricity:  18000,
    marketing:    25000,
    tech:          5299,
  },
};
```

Save the file. Refresh the browser. Done.

---

## Add a new board

1. Copy any existing board file in `/boards/`
2. Rename it (e.g. `billing.html`)
3. Add it to the `BOARDS` array in `shared/shared.js`:
   ```js
   { id: "billing", file: "billing.html", label: "Billing board", icon: "doc", roles: ["owner"] },
   ```
4. Add a card to `index.html`

It will automatically appear in the sidebar navigation of every board.
