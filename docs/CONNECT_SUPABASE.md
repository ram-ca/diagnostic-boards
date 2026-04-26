# Connecting to Supabase (Live Data)

Right now all boards show demo data. This guide is for your developer
to connect them to real data from PathLIMS via Supabase.

## Step 1 — Create Supabase project

1. Go to supabase.com → Sign up free
2. New project → name it `sharada-diagnostics`
3. Settings → API → copy:
   - Project URL
   - anon public key

## Step 2 — Update config

Open `shared/shared.js` and change:

```js
data: { mode: "demo" },   // ← change to "supabase"
supabase: {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-KEY",
},
```

## Step 3 — Create the 8 tables

Run this SQL in Supabase → SQL Editor:

```sql
-- Patients
create table patients (
  id text primary key,
  name text,
  age int,
  gender text,
  phone text,
  doctor text,
  tests text[],
  status text,
  source text,
  amount int,
  payment_mode text,
  registered_at timestamptz default now()
);

-- Reports
create table reports (
  id text primary key,
  patient_id text references patients(id),
  test text,
  value text,
  ref_range text,
  is_abnormal boolean default false,
  status text,
  tat_hours numeric,
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- Invoices
create table invoices (
  id text primary key,
  patient_id text references patients(id),
  amount int,
  payment_mode text,
  collected_at timestamptz default now()
);

-- Doctors
create table doctors (
  id serial primary key,
  name text unique,
  speciality text,
  phone text,
  referral_count int default 0,
  created_at timestamptz default now()
);

-- Entries (daily summary)
create table entries (
  id serial primary key,
  date date unique,
  total_patients int,
  home_collection int,
  walkin int,
  referred int,
  revenue int
);

-- Reagents
create table reagents (
  id serial primary key,
  name text unique,
  stock_units int,
  daily_usage int,
  cost_per_unit int,
  supplier text,
  supplier_phone text,
  updated_at timestamptz default now()
);

-- Expenses
create table expenses (
  id serial primary key,
  month date,
  salaries int,
  rent int,
  emi int,
  electricity int,
  marketing int,
  tech int,
  other int
);

-- Staff
create table staff (
  id serial primary key,
  name text,
  role text,
  date date,
  status text,
  clock_in text,
  tasks_done int,
  salary int,
  attendance_pct int
);
```

## Step 4 — Developer replaces demo data functions

In each board file, find the `render()` function.
Replace the mock data generation with Supabase queries.

Example for patient board:

```js
// BEFORE (demo data)
const total = R(38, 62);

// AFTER (real Supabase data)
const { data: pts } = await supabase
  .from('patients')
  .select('*')
  .eq('registered_date', today());
const total = pts.length;
```

## Step 5 — Connect PathLIMS → Supabase

PathLIMS fires a webhook when a patient is registered.
Your developer writes a small server function that:
1. Receives the PathLIMS webhook
2. Inserts the patient data into Supabase

One-time setup. After that, data flows automatically.
