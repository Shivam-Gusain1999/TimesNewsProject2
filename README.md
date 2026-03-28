# Times News Platform 🗞️

A comprehensive, full-stack journalism and news distribution platform built for scale. Times News features a highly-optimized public newsfeed, native YouTube integrations, and a secure Role-Based Access Control (RBAC) Admin Dashboard for seamless content management.

---

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS (fully responsive, mobile-first design)
- **Routing:** React Router DOM
- **State Management:** React Context API (`UserContext`)
- **SEO & Meta:** React Helmet Async (for dynamic OpenGraph tags and social sharing)
- **Icons:** Lucide React

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Mongoose (with Compound Indexes for multi-field scaling)
- **Authentication:** JWT (Http-Only cookies, short-lived Access + long-lived Refresh tokens)
- **File Storage:** Cloudinary (Multipar/form-data via Multer)
- **Security:** Helmet.js, rate-limiting, and strict CORS handling

---

## ✨ Core Features

### For Readers
- **Infinite Scroll Feed:** Buttery-smooth feed featuring bi-directional sticky sidebars and native HTML5 lazy-loading for heavy assets.
- **Dynamic Content:** Supports standard articles, YouTube video embeds, Web Stories, and e-Papers.
- **Categorization:** Advanced category filtering (e.g., Top News, Sports, Tech, Politics).
- **Live Widgets:** Real-time localized Weather & AQI widgets (Open-Meteo API).

### For Administrators (CMS)
- **Multi-Role Support:** Admins, Editors, Reporters, and Standard Users.
- **Rich Text Management:** Create, Read, Update, and Delete capabilities for all articles and videos.
- **Monetization:** Built-in Ad placement engine (sidebar and feed ad slots via scripts or images).
- **Analytics Dashboard:** Real-time tracking of active users, total articles, and month-over-month growth metrics.

---

## 🛠️ Project Setup & Installation

Follow these steps to get the project running locally for development.

### 1. Pre-requisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Cloudinary Account** (for media uploads)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd TimesNewsProjectShiAnkit
```

### 3. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and add the following variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend development server:
```bash
npm run dev
```

### 4. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory and add the backend API URL:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🏗️ Project Architecture
```text
TimesNewsProjectShiAnkit/
│
├── backend/                   # Express.js Server
│   ├── src/
│   │   ├── controllers/       # Business logic (users, articles, settings)
│   │   ├── middlewares/       # JWT Auth, Multer, Error handling
│   │   ├── models/            # Mongoose Schemas
│   │   ├── routes/            # Express Routers
│   │   ├── utils/             # Cloudinary config, ApiError helpers
│   │   └── app.js             # Express configuration & Security headers
│   └── package.json
│
└── frontend/                  # React Vite Application
    ├── src/
    │   ├── assets/            # Axios API configurations
    │   ├── components/        # Reusable UI widgets & Pages
    │   │   └── admin/         # CMS Dashboard components
    │   ├── App.jsx            # Main Router & Helmet Provider
    │   └── main.jsx           # React DOM root
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## 🔒 Security & Performance Handover Notes
This project has recently been audited for production readiness:
1. **Codebase Internationalization:** All developer documentation and code comments have been translated to pure English, making it highly maintainable for global development teams.
2. **Scroll Jank Eliminated:** The heavy javascript-based sidebars were replaced with optimized, hardware-accelerated `requestAnimationFrame` loops, delivering native-app like smooth scrolling.
3. **Database Scalability:** Compound indices (`status` + `category` + `createdAt`) were implemented at the Mongoose level, guaranteeing query speeds remain instant even beyond 100,000 articles.
4. **Security Hardened:** `helmet()` is active to block Cross-Site Scripting (XSS), and CORS is strictly verified.

---
*Maintained and Developed by Shivam & Ankit.*
