# GLOBETROTTER
### *Explore Beyond Boundaries.*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-gold.svg)](https://react.dev)
[![AI Integration](https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg)](https://aistudio.google.com)
[![Cartography](https://img.shields.io/badge/Maps-Leaflet%20%26%20OpenStreetMap-brightgreen.svg)](https://leafletjs.com)
[![Visualizations](https://img.shields.io/badge/Charts-Recharts-blue.svg)](https://recharts.org)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 🌟 Overview

**GLOBETROTTER** is an enterprise-grade, advanced AI-powered luxury travel planning web application built on the modern MERN stack (MongoDB, Express.js, React 18, Node.js). 

Engineered with a dark-luxury aesthetic inspired by high-end international travel publications and boutique concierge services, Globetrotter empowers travelers to discover global sanctuaries, generate bespoke day-wise itineraries using Google Gemini AI, explore high-precision cartography via Leaflet and OpenStreetMap, track multi-category travel expenses, and manage bookings within a responsive, glassmorphic UI.

---

## 💎 Design System & Palette

- **Primary Background:** `#080B10`
- **Secondary Background:** `#111720`
- **Card Background:** `#151C26`
- **Gold Accent:** `#D6B477` / `#E8D4A8` / `#B08C4A`
- **Main Typography:** *Playfair Display* (Editorial Headings)
- **Body Typography:** *DM Sans* (Clean Contemporary Sans-Serif)

---

## 🚀 Key Features

1. **Cinematic Landing Page:** Curated hero experience, dynamic destination searches, featured sanctuaries, category showcases, testimonials, and dispatches.
2. **Curated Destination Discovery:** Real-time search, multi-category filters (Mountains, Beaches, Adventure, Historical Places, Temples, Wildlife, Cities, Romantic Destinations), country filters, budget sliders, rating filters, and grid/map split views.
3. **Google Gemini AI Trip Planner:** Personalized itinerary synthesis generating day-wise schedules (morning, afternoon, evening activities with financial estimations), key highlights, concierge advice, and category budget allocations.
4. **Interactive Leaflet Cartography:** OpenStreetMap tiles styled in high-luxury dark matter cartography with custom golden compass pins and interactive attraction popups.
5. **Voyage Portfolio Management:** Create, save, view, edit, and delete trips with real-time lifecycle tracking (`Planned`, `Upcoming`, `Ongoing`, `Completed`, `Cancelled`).
6. **Smart Expense Ledger & Recharts Analytics:** Log multi-category expenditures (Transportation, Accommodation, Food, Activities, Shopping, Misc), compare budgeted vs actual figures with interactive Donut and Bar charts, and monitor remaining liquidity.
7. **Sovereign Authentication & RBAC:** Secure JWT-based authentication with HTTP-only cookies, bcryptjs password hashing, role-based access control (`user` vs `admin`), and profile customization.
8. **Executive Administrator Dashboard:** High-level platform KPIs (total users, destinations, trips, reviews), destination CRUD operations, user role escalation/de-escalation, and community review moderation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React, Recharts, Leaflet, React-Leaflet, Axios |
| **Backend** | Node.js, Express.js, REST API Architecture, Cookie-Parser, Morgan, CORS, Dotenv |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Artificial Intelligence** | Google Gemini API (`gemini-1.5-flash`) with intelligent luxury fallback generator |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, HTTP-only Cookies, Protected Routes |

---

## ⚡ Quickstart Guide (Windows PowerShell)

### Prerequisites
- **Node.js** (v18.x or later installed)
- **MongoDB** (local service running or MongoDB Atlas connection string)
- **npm** (v9.x or later)

### 1. Clone & Setup Project
Open **PowerShell** in the project directory:
```powershell
cd c:\Users\manik\Downloads\globetrotter
```

### 2. Environment Variables Configuration

#### Backend Configuration:
Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/globetrotter
JWT_SECRET=globetrotter_luxury_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=30d
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```
> *Tip: Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/). If omitted, Globetrotter automatically utilizes its built-in intelligent luxury fallback engine without crashing!*

#### Frontend Configuration:
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Database Seeding (Sample Data)
To seed the database with luxury destinations across Greece, Japan, Switzerland, India, Italy, Indonesia, France, and New Zealand, run:
```powershell
npm run seed --prefix backend
```

#### Pre-Configured Testing Credentials:
| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@globetrotter.com` | `admin123456` | Full Admin Privileges |
| **Demo Traveler** | `traveler@globetrotter.com` | `traveler123456` | Explorer Member |

---

### 4. Running the Complete Application

To run both backend and frontend concurrently:
```powershell
npm run dev
```

Alternatively, open two PowerShell terminals:

**Terminal 1 (Backend Server):**
```powershell
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```powershell
cd frontend
npm run dev
# Web app running at http://localhost:5173
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register member account
- `POST /api/auth/login` — Sign in and issue JWT cookie/token
- `POST /api/auth/logout` — Invalidate session cookie
- `GET  /api/auth/me` — Retrieve current authenticated member

### Destinations
- `GET    /api/destinations` — Query destinations (search, category, budget, sort, pagination)
- `GET    /api/destinations/featured` — Retrieve top curated featured destinations
- `GET    /api/destinations/:id` — Retrieve destination dossier and verified reviews
- `POST   /api/destinations` — Publish new destination *(Admin only)*
- `PUT    /api/destinations/:id` — Update destination parameters *(Admin only)*
- `DELETE /api/destinations/:id` — Remove destination *(Admin only)*

### AI Travel Planner
- `POST /api/ai/generate-itinerary` — Synthesize day-wise schedule, budget breakdown, and travel tips via Gemini

### Trips & Journeys
- `GET    /api/trips` — List member trips with computed expenditure metrics
- `POST   /api/trips` — Save new trip or AI itinerary
- `GET    /api/trips/:id` — Fetch trip details and related expense ledger
- `PUT    /api/trips/:id` — Update trip dates, budget, travelers, or status
- `DELETE /api/trips/:id` — Delete trip and related expenses

### Budget & Expenses
- `GET    /api/expenses` — Retrieve expense list and category breakdowns
- `POST   /api/expenses` — Log a new transaction
- `PUT    /api/expenses/:id` — Edit transaction
- `DELETE /api/expenses/:id` — Remove transaction

### Reviews
- `GET    /api/reviews/:destinationId` — Fetch reviews for destination
- `POST   /api/reviews` — Submit verified review
- `DELETE /api/reviews/:id` — Delete review *(Author or Admin)*

### Administration
- `GET    /api/admin/stats` — Retrieve platform KPI metrics
- `GET    /api/admin/users` — List all members
- `PUT    /api/admin/users/:id/role` — Update member role (admin/user)
- `DELETE /api/admin/users/:id` — Delete user account
- `PUT    /api/admin/destinations/:id/toggle-featured` — Toggle featured status
- `GET    /api/admin/reviews` — Retrieve all reviews for moderation

---

## 🌐 Production Deployment

### Frontend (Vercel)
1. Push project to GitHub.
2. In Vercel, import repository and set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy!

### Backend (Render)
1. In Render, create a new **Web Service** pointing to repository.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/globetrotter`
   - `JWT_SECRET` = `<secure_random_string>`
   - `GEMINI_API_KEY` = `<your_gemini_key>`
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
6. Deploy!

---

## 🎓 College Project Verification Checklist

- [x] Full MVC Backend Architecture implemented
- [x] Secure JWT Authentication with HTTP-only cookies and bcrypt hashing
- [x] 12 Complete React routes and pages
- [x] Google Gemini AI integration with prompt engineering and structured schema
- [x] Interactive Leaflet + OpenStreetMap maps with custom pins
- [x] Recharts financial analytics (Pie charts, Bar charts, budget vs actual)
- [x] Database seed script with rich realistic destinations from India and worldwide
- [x] Admin dashboard with role-based access control and moderation tools
- [x] Dark-luxury responsive design with glassmorphism and gold accents
- [x] Comprehensive documentation and build verification

**GLOBETROTTER — Explore Beyond Boundaries.**
