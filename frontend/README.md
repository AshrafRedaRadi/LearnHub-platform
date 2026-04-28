# 🎓 Frontend - Online Course Platform

The frontend for the LearnHub educational platform built with Next.js 16.

## 📋 Table of Contents

- [Overview](#-overview)
- [File Structure](#-file-structure)
- [Pages](#-pages)
- [Components](#-components)
- [Libraries](#-libraries)
- [Getting Started](#-getting-started)

---

## 📖 Overview

Frontend built with:
- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **NextAuth.js** for authentication
- **Axios** for API calls

---

## 📂 File Structure

```
frontend/
├── public/
│   └── (static files)
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Home page
│   │   │
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.js  # NextAuth API
│   │   │
│   │   ├── categories/         # Categories page
│   │   ├── courses/
│   │   │   └── [id]/           # Course details page
│   │   ├── dashboard/          # Dashboard
│   │   ├── dashboard/courses/ # Course management
│   │   ├── forgot-password/    # Forgot password
│   │   ├── learn/
│   │   │   └── [courseId]/     # Learning page
│   │   ├── login/              # Login page
│   │   ├── my-learning/        # My courses
│   │   ├── notifications/     # Notifications
│   │   ├── profile/           # Profile page
│   │   └── register/          # Registration page
│   │
│   ├── components/             # React components
│   │   ├── AuthGuard.js        # Route protection
│   │   ├── AuthProvider.js     # Auth context provider
│   │   ├── ClientWrapper.js   # Client wrapper
│   │   ├── CourseImage.js      # Course image
│   │   ├── Footer.js           # Footer
│   │   ├── Navbar.js           # Navigation bar
│   │   ├── OAuthBridge.js      # OAuth bridge
│   │   ├── SessionProviderWrapper.js
│   │   ├── ThemeProvider.js    # Theme provider
│   │   └── ui/                 # UI components
│   │       ├── Button.js
│   │       ├── Card.js
│   │       ├── Input.js
│   │       ├── PasswordChecklist.js
│   │       └── PasswordInput.js
│   │
│   └── lib/                    # Helper libraries
│       ├── api.js              # Axios instance
│       ├── auth.js             # Auth functions
│       └── images.js           # Default images
│
├── .env.local                  # Environment variables
├── .env.example               # Environment template
├── next.config.mjs            # Next.js config
├── package.json               # Dependencies
└── tailwind.config.mjs        # Tailwind config
```

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/login` | Login |
| `/register` | Registration |
| `/forgot-password` | Password recovery |
| `/categories` | Categories |
| `/courses/[id]` | Course details |
| `/learn/[courseId]` | Learning page |
| `/my-learning` | Enrolled courses |
| `/dashboard` | Dashboard |
| `/dashboard/courses` | Course management |
| `/profile` | Profile |
| `/notifications` | Notifications |

---

## 🧩 Components

### Core Components
- **Navbar** - Navigation bar with links
- **Footer** - Site footer
- **Card** - Content card
- **Button** - Styled button
- **Input** - Form input
- **PasswordInput** - Password input with validation
- **PasswordChecklist** - Password validation checklist

### Auth Components
- **AuthGuard** - Route protection
- **AuthProvider** - Auth context provider
- **OAuthBridge** - OAuth authentication bridge
- **SessionProviderWrapper** - NextAuth session provider

---

## 📦 Libraries

### lib/api.js
```javascript
// Axios instance with base configuration
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### lib/auth.js
```javascript
// Auth functions
export const login = async (email, password) => { ... }
export const register = async (userData) => { ... }
export const logout = async () => { ... }
export const getCurrentUser = async () => { ... }
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy configuration file
copy .env.example .env.local

# Run development server
npm run dev
```

Application runs on: `http://localhost:3000`

---

## ⚙️ Environment Variables

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔧 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run in development mode |
| `npm run build` | Build for production |
| `npm run start` | Run in production mode |
| `npm run lint` | Lint code |

---

## 🎨 Styling

The system uses **Tailwind CSS** for styling:

```javascript
// Example usage
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold">Title</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    Button
  </button>
</div>
```

---

## 🔐 Authentication

The system uses **NextAuth.js** with:
- GitHub OAuth login
- JWT token storage
- Route protection via AuthGuard

> ⚠️ **Important**: Do not commit the actual `.env.local` file, use `.env.example` as a reference.