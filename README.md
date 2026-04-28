# 🎓 Online Course Platform

A full-stack educational platform for building and managing online courses.

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)

---

## 📖 Overview

LearnHub is an integrated course management system supporting:
- ✅ User registration and authentication
- ✅ Course management (create, update, delete)
- ✅ Lesson management within courses
- ✅ GitHub OAuth integration
- ✅ Admin dashboard
- ✅ Student progress tracking

---

## 📂 Project Structure

```
onlineCoursePlatform/
├── backend/           # Node.js + Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── middlewares/  # Auth & Role middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # Route definitions
│   ├── utils/        # Helper utilities
│   └── validations/  # Data validation
│
└── frontend/         # Next.js 16 App
    ├── src/
    │   ├── app/      # Next.js App Router
    │   ├── components/  # React components
    │   └── lib/     # Helper libraries
    └── public/      # Static assets
```

---

## 🛠 Tech Stack

### Backend
| Technology | Description |
|------------|-------------|
| Node.js | JavaScript runtime |
| Express.js | Web API framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Joi | Data validation |
| bcryptjs | Password hashing |

### Frontend
| Technology | Description |
|------------|-------------|
| Next.js 16 | React framework |
| NextAuth.js | Authentication |
| Tailwind CSS | Styling |
| Axios | HTTP client |

---

## 🔧 Requirements

```bash
# Required
Node.js >= 18
MongoDB >= 6
npm >= 9
```

---

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone <repository-url>
cd onlineCoursePlatform
```

### 2. Run Backend

```bash
cd backend

# Install dependencies
npm install

# Copy configuration file
copy .env.example .env
# Then edit the file with your settings

# Run the server
npm run dev
```

Server runs on: `http://localhost:5000`

### 3. Run Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy configuration file
copy .env.example .env.local
# Then edit the file with your settings

# Run the application
npm run dev
```

Application runs on: `http://localhost:3000`

### 4. Seed database with sample data

```bash
cd backend
npm run seed
```

---

## 🗄 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'student', 'instructor', 'admin'),
  avatar: String,
  enrolledCourses: [{ type: ObjectId, ref: 'Course' }],
  createdAt: Date
}
```

### Course Collection
```javascript
{
  title: String,
  description: String,
  thumbnail: String,
  instructor: { type: ObjectId, ref: 'User' },
  category: String,
  price: Number,
  lessons: [{ type: ObjectId, ref: 'Lesson' }],
  students: [{ type: ObjectId, ref: 'User' }],
  isPublished: Boolean,
  createdAt: Date
}
```

### Lesson Collection
```javascript
{
  title: String,
  description: String,
  videoUrl: String,
  duration: Number,
  order: Number,
  course: { type: ObjectId, ref: 'Course' },
  createdAt: Date
}
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get single course |
| POST | `/api/courses` | Create course (instructor/admin) |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/:courseId` | Get course lessons |
| POST | `/api/lessons` | Add new lesson |
| PUT | `/api/lessons/:id` | Update lesson |
| DELETE | `/api/lessons/:id` | Delete lesson |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (admin) |
| GET | `/api/users/:id` | Get single user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (admin) |

---

## ⚙️ Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/online-course
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📦 Deployment

### Backend (Render / Railway)
```bash
# Make sure to add environment variables in dashboard
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-production-secret
NODE_ENV=production
```

### Frontend (Vercel)
```bash
# Make sure to add environment variables
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
NEXT_PUBLIC_API_URL=https://your-backend-api/api
```

---

## 📄 License

MIT License - Feel free to use this project for learning and development.