<div align="center">

# 🏥 VitaCore — Full-Stack Hospital Management System

**Run your hospital with clarity, not chaos.**

A modern, beautiful, and responsive hospital management platform for patients, doctors,
appointments, departments, and billing — built with React + Vite on the front and
Express + MongoDB on the back.

![Stack](https://img.shields.io/badge/React-18-061b2c?logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-06b6d4)

</div>

---

## ✨ Highlights

- **Two ways to run** — a fully functional **Demo Mode** (no backend, data persisted in
  `localStorage`) and a live **API Mode** backed by Express + MongoDB. Flip a single env flag.
- **Complete CRUD** for Patients, Doctors, Appointments, Departments, and Invoices.
- **JWT authentication** with role-based access (`admin`, `doctor`, `receptionist`).
- **Live dashboard** with animated counters, revenue trend & department charts (Recharts).
- **Delightful UX** — glassmorphism, aurora gradients, Framer Motion micro-interactions,
  dark/light theme, `⌘K` command palette, toast notifications, and fully responsive layouts
  (mobile cards → desktop tables).
- **Itemized billing** with automatic total calculation (items × qty + tax − discount).
- **Naira (₦) currency** formatting throughout.

---

## 🧱 Tech Stack

| Layer        | Technologies                                                                 |
| ------------ | ---------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, Framer Motion, Zustand, TanStack Query, Recharts, Axios, lucide-react |
| **Backend**  | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Helmet, Morgan           |
| **Testing**  | Jest, Supertest, mongodb-memory-server                                       |

---

## 📁 Project Structure

```
VitaCore-MedApp/
├── package.json            # Root scripts (run client + server together)
├── .env.example            # Documents every env var across the stack
├── client/                 # React + Vite single-page app
│   ├── .env.example
│   └── src/
│       ├── lib/            # apiClient, demoDb, dataService, seed, formatters
│       ├── store/          # Zustand stores (auth, ui)
│       ├── hooks/          # TanStack Query data hooks
│       ├── components/     # UI primitives, layout, data table & forms
│       └── pages/          # Landing, Login, Dashboard, Patients, Doctors, …
└── server/                 # Express + MongoDB REST API
    ├── .env.example
    └── src/
        ├── config/         # env + db connection
        ├── models/         # Mongoose schemas
        ├── controllers/    # auth + dashboard logic
        ├── routes/         # REST endpoints
        ├── middleware/     # auth (JWT) + error handling
        ├── utils/          # generic CRUD controller factory
        └── seed.js         # demo data seeder
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 18** and npm
- **MongoDB** (only for API Mode) — local install or Docker:
  ```bash
  docker run -d --name vitacore-mongo -p 27017:27017 mongo:7
  ```

### 1. Clone & install

```bash
git clone https://github.com/Murphine22/VitaCore-MedApp.git
cd VitaCore-MedApp
npm run install:all          # installs root, server, and client deps
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3a. Run in Demo Mode (no backend required)

Set `VITE_USE_API=false` in `client/.env`, then:

```bash
npm run dev:client
```

Open **http://localhost:3000** and sign in with a demo account (see below).

### 3b. Run in Full API Mode (client + server)

Set `VITE_USE_API=true` in `client/.env`, seed the database, then run both apps:

```bash
npm run seed                 # populate MongoDB with demo data
npm run dev                  # starts API (:5000) and client (:3000) together
```

---

## 🔐 Demo Accounts

The seeder (and Demo Mode) create these users — password is **`password123`** for all:

| Role         | Email                  |
| ------------ | ---------------------- |
| Admin        | `admin@vitacore.io`    |
| Doctor       | `doctor@vitacore.io`   |
| Receptionist | `reception@vitacore.io`|

> You can also register a brand-new account from the login screen.

---

## ⚙️ Environment Variables

### `server/.env`

```dotenv
# Port the Express API listens on
PORT=5000
# development | production | test
NODE_ENV=development
# MongoDB connection string
MONGODB_URI=mongodb://127.0.0.1:27017/vitacore
# JWT signing secret — use a long random string in production
JWT_SECRET=super_secret_change_me
# Access token lifetime
JWT_EXPIRES_IN=7d
# Comma-separated allowed CORS origins
CLIENT_ORIGIN=http://localhost:3000
```

### `client/.env`

```dotenv
# Base URL of the VitaCore API
VITE_API_URL=http://localhost:5000/api
# "true"  => connect to the live API
# "false" => run standalone in Demo Mode (localStorage)
VITE_USE_API=false
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

All resource routes require a `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint         | Description                | Auth |
| ------ | ---------------- | -------------------------- | ---- |
| POST   | `/auth/register` | Register a new user        | —    |
| POST   | `/auth/login`    | Log in, returns JWT + user | —    |
| GET    | `/auth/me`       | Current authenticated user | ✅   |

### Resources (`patients`, `doctors`, `departments`, `appointments`, `invoices`)

Each resource exposes a standard REST surface:

| Method | Endpoint            | Description                                            |
| ------ | ------------------- | ----------------------------------------------------- |
| GET    | `/<resource>`       | List (supports `?search=`, `?status=`, `?sort=`, `?page=&limit=`) |
| GET    | `/<resource>/:id`   | Get one                                               |
| POST   | `/<resource>`       | Create                                                |
| PUT    | `/<resource>/:id`   | Update                                                |
| DELETE | `/<resource>/:id`   | Delete                                                |

> Department writes are restricted to the `admin` role.

### Dashboard & Health

| Method | Endpoint            | Description                          | Auth |
| ------ | ------------------- | ------------------------------------ | ---- |
| GET    | `/health`           | Service health check                 | —    |
| GET    | `/dashboard/stats`  | Aggregated totals, trends & charts   | ✅   |

#### Example

```bash
# Log in
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@vitacore.io","password":"password123"}'

# List patients (use the token from the login response)
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🧪 Testing

The backend ships with an integration test suite (Jest + Supertest) that spins up an
in-memory MongoDB — **no running database required**:

```bash
npm test            # from the repo root (runs server tests)
```

Covers health checks, auth (register/login/guarded routes), patient CRUD, and invoice
total computation.

---

## 📜 Scripts

Run from the repo root:

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run install:all`| Install root + server + client dependencies  |
| `npm run dev`        | Run API and client together (concurrently)   |
| `npm run dev:server` | Run the Express API only                      |
| `npm run dev:client` | Run the Vite client only                      |
| `npm run seed`       | Seed MongoDB with demo data                   |
| `npm run build`      | Production build of the client                |
| `npm run lint`       | Lint the client                               |
| `npm test`           | Run backend tests                             |

---

## 🗺️ Modules

- **Dashboard** — KPIs, revenue trend, appointments by department, recent activity.
- **Patients** — demographics, blood group, allergies, status (active/admitted/discharged).
- **Doctors** — specialties, departments, fees, ratings, availability.
- **Appointments** — book, reschedule, and track status (scheduled/completed/cancelled/no-show).
- **Departments** — color-coded cards with head doctor, location, and contact.
- **Billing** — itemized invoices with tax/discount and live total, payment status & method.
- **Settings** — theme, data-mode indicator, and demo data reset.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Make your changes (keep `npm run lint` and `npm test` green).
3. Open a pull request.

---

## 📄 License

[MIT](LICENSE) © VitaCore
