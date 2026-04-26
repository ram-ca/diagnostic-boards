# Deploying the Boards Online

Once online, you open the boards on your phone from anywhere.

---

## Option 1 — GitHub Pages (recommended, free)

### One-time setup

```bash
# In VS Code terminal (Ctrl + `)
git init
git add .
git commit -m "first commit"

# Create repo on github.com first, then:
git remote add origin https://github.com/YOUR-USERNAME/sharada-diagnostics.git
git push -u origin main
```

Then on GitHub:
- Settings → Pages → Source: Deploy from branch → main → / (root) → Save
- Live at: `YOUR-USERNAME.github.io/sharada-diagnostics`

### Push an update

```bash
git add .
git commit -m "updated costs"
git push
```

Site updates in 60 seconds automatically.

---

## Option 2 — Netlify (easiest, free)

1. Go to app.netlify.com/drop
2. Drag the entire `sharada-diagnostics` folder
3. Get a live URL immediately
4. Create account to keep the URL

---

## Option 3 — Vercel (free, auto-deploys from GitHub)

1. Push to GitHub (Option 1 first)
2. Go to vercel.com → Import from GitHub
3. Select `sharada-diagnostics` repo → Deploy
4. Every `git push` auto-deploys

---

## Custom domain (optional)

Buy `sharadadiagnostics.in` from GoDaddy (~₹800/year).
Point it to Netlify or Vercel — your developer sets this up in 30 min.
Staff open `boards.sharadadiagnostics.in` instead of a random URL.
