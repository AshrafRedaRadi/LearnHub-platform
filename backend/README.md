# 🎓 Backend - Online Course Platform

The API backend for the LearnHub educational platform.

## 📋 Table of Contents

- [Overview](#-overview)
- [File Structure](#-file-structure)
- [Endpoints](#-endpoints)
- [Authentication](#-authentication)
- [Middlewares](#-middlewares)
- [Validation](#-validation)

---

## 📖 Overview

REST API built with:
- **Node.js** + **Express.js**
- **MongoDB** as database
- **JWT** for authentication
- **Joi** for data validation

---

## 📂 File Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
│
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── courseController.js # Course logic
│   ├── lessonController.js # Lesson logic
│   └── userController.js  # User logic
│
├── middlewares/
│   ├── authMiddleware.js  # JWT verification
│   ├── errorMiddleware.js # Error handling
│   └── roleMiddleware.js  # Role verification
│
├── models/
│   ├── Course.js         # Course model
│   ├── Lesson.js         # Lesson model
│   └── User.js           # User model
│
├── routes/
│   ├── authRoutes.js     # Auth routes
│   ├── courseRoutes.js   # Course routes
│   ├── lessonRoutes.js   # Lesson routes
│   └── userRoutes.js     # User routes
│
├── utils/
│   ├── backfillCourseImages.js # Default images
│   ├── courseImageDefaults.js  # Image defaults
│   ├── generateToken.js        # JWT generation
│   └── seed.js                 # Sample data
│
├── validations/
│   ├── authValidation.js    # Auth validation
│   ├── courseValidation.js  # Course validation
│   └── lessonValidation.js  # Lesson validation
│
├── .env                     # Environment variables
├── .env.example            # Environment template
├── app.js                  # Express app
├── package.json            # Dependencies
└── server.js              # Entry point
```

---

## 🌐 Endpoints

### Auth
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
| POST | `/api/courses` | Create new course |
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
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get single user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

---

## 🔐 Authentication

The system uses **JWT (JSON Web Token)** for authentication:

1. On login, a token is issued for 7 days
2. Every request requires the token in the Header:
   ```
   Authorization: Bearer <token>
   ```

### Roles
| Role | Description |
|------|-------------|
| `student` | Can view and enroll in courses |
| `instructor` | Can create and manage courses |
| `admin` | Can manage everything |

---

## ⚙️ Middlewares

### authMiddleware.js
- Verifies token existence in request
- Validates token authenticity
- Adds user data to `req.user`

### roleMiddleware.js
- Verifies user role
- Grants access based on role

### errorMiddleware.js
- Unified error handling
- Error logging

---

## ✅ Validation

The system uses **Joi** for input validation:

```javascript
// Example
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy configuration file
copy .env.example .env

# Run server
npm run dev    # Development mode
npm start      # Production mode
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run in development mode |
| `npm start` | Run in production mode |
| `npm run seed` | Add sample data |
| `npm run backfill:images` | Fill course images |
| `npm run seed:destroy` | Delete all data |

---

## 🔧 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/online-course
JWT_SECRET=your-secret-key
NODE_ENV=development
```

> ⚠️ **Important**: Do not commit the actual `.env` file, use `.env.example` as a reference.