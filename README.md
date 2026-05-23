<div align="center">

# 🌌 AnalytIQ — AI-Powered E-Commerce Analytics Platform

### ⚡ Real-Time Insights • 📊 Smart Dashboards • 🔐 Secure Role-Based Access • 🚀 Modern MERN Architecture

<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=28&duration=3000&color=00F7FF&center=true&vCenter=true&width=1000&lines=Premium+Full+Stack+Analytics+Platform;AI-Inspired+Dashboard+Experience;Role-Based+Access+Control+(RBAC);Real-Time+Sales+Analytics;JWT+Authentication+%26+Secure+API;Built+With+React+%2B+Node.js+%2B+MongoDB" />

<br/>

<img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/Charts-Chart.js-FF6384?style=for-the-badge" />
<img src="https://img.shields.io/badge/UI-Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />

<br/><br/>

<a href="https://gyanaranjanportfolio.lovable.app/" target="_blank">
  <img src="https://img.shields.io/badge/🚀 Live Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</a>

<a href="https://www.linkedin.com/in/gyanaranjansahoo0033/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<a href="https://github.com/CoderGyanaa" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

</div>

---

> 🚀 A premium production-grade MERN analytics dashboard engineered for modern businesses with advanced data visualization, authentication, role-based access control, and scalable backend architecture.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 JWT Authentication | Login, register, token refresh, protected routes |
| 👥 Role-Based Access | Admin · Analyst · Viewer permissions |
| 📊 Live Dashboards | KPI cards with growth indicators |
| 📈 Revenue Charts | Line, donut, bar charts via Chart.js |
| 🗓️ Date Filters | 7D / 30D / 90D / 1Y / Custom range |
| 📦 Sales Table | Pagination, search, multi-filter |
| 📥 CSV Export | Export sales data & analytics summaries |
| 🌍 Geo Analytics | Revenue by country |
| 👤 Team Management | Create/edit/deactivate users (admin) |
| 🌱 Demo Seed | 500 realistic sales records auto-seeded |

---

## 🗂 Project Structure

```
analytics-app/
├── backend/
│   ├── controllers/       # Business logic
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── export.controller.js
│   │   ├── sales.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT + RBAC
│   ├── models/
│   │   ├── User.js
│   │   ├── Sale.js
│   │   └── Metric.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── analytics.routes.js
│   │   ├── sales.routes.js
│   │   ├── user.routes.js
│   │   └── export.routes.js
│   ├── seed/
│   │   └── seed.js              # 500 demo records
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── charts/           # RevenueChart, CategoryChart, ChannelChart
    │   │   ├── layout/           # AppLayout, Sidebar, Topbar
    │   │   └── ui/               # KPICard, DateFilter
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── hooks/
    │   │   └── useAnalytics.js   # Data fetching hooks
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Sales.jsx
    │   │   ├── Analytics.jsx
    │   │   └── Team.jsx
    │   ├── services/
    │   │   └── api.js            # Axios instance
    │   └── utils/
    │       └── format.js         # Currency, date, number formatters
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Setup Backend

```bash
cd analytics-app/backend
npm install

# Copy env and configure
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/analytics_app
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Seed Demo Data

```bash
# From backend folder
npm run seed
```

This creates **500 sales records** and **3 demo users**:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin@123 |
| Analyst | analyst@demo.com | Analyst@123 |
| Viewer | viewer@demo.com | Viewer@123 |

### 3. Start Backend

```bash
npm run dev       # Development (nodemon)
# or
npm start         # Production
```

Backend runs at → `http://localhost:5000`

### 4. Setup Frontend

```bash
cd analytics-app/frontend
npm install
cp .env.example .env
```

`.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start Frontend

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login, get token |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update profile |

### Analytics
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/analytics/kpis` | Private | Revenue, profit, orders KPIs |
| GET | `/api/analytics/revenue-trend` | Private | Time-series revenue data |
| GET | `/api/analytics/category-breakdown` | Private | Revenue by product category |
| GET | `/api/analytics/channel-performance` | Private | Revenue by acquisition channel |
| GET | `/api/analytics/geo-breakdown` | Private | Revenue by country |
| GET | `/api/analytics/recent-activity` | Private | Latest 10 orders |

**Query params** (most endpoints): `startDate`, `endDate`, `groupBy`

### Sales
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/sales` | Private | List with filters + pagination |
| POST | `/api/sales` | Admin/Analyst | Create sale |
| PUT | `/api/sales/:id` | Admin/Analyst | Update sale |
| DELETE | `/api/sales/:id` | Admin only | Delete sale |

**Query params**: `page`, `limit`, `status`, `category`, `channel`, `search`, `startDate`, `endDate`

### Export
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/export/sales` | Private | Download sales CSV |
| GET | `/api/export/analytics` | Private | Download analytics summary CSV |

### Team (Admin only)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create user |
| PUT | `/api/users/:id` | Admin | Update role/status |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — database & ODM
- **JWT** + **bcryptjs** — authentication
- **Morgan** — request logging

### Frontend
- **React 18** + **Vite** — fast dev + HMR
- **React Router v6** — client-side routing
- **Axios** — HTTP client with interceptors
- **Chart.js** + **react-chartjs-2** — data visualization
- **Bootstrap 5** — responsive grid & utilities
- **Bootstrap Icons** — icon library

---

## 🔒 Role Permissions

| Feature | Admin | Analyst | Viewer |
|---------|-------|---------|--------|
| View dashboards | ✅ | ✅ | ✅ |
| Export CSV | ✅ | ✅ | ✅ |
| Create/edit sales | ✅ | ✅ | ❌ |
| Delete sales | ✅ | ❌ | ❌ |
| Team management | ✅ | ❌ | ❌ |

---

## 🌐 Production Deployment

### Backend (Railway / Render / Heroku)
1. Set all env vars in platform dashboard
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas connection string

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL=https://your-backend-url.com/api`
2. Build: `npm run build`
3. Deploy `dist/` folder

---

## 📝 License

MIT — free for personal and commercial use.
