const express = require('express');
const {
  getLessonsByCourse,
  createLesson,
  updateLesson
} = require('../controllers/lessonController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router({ mergeParams: true });

// Route to get lessons by course
// Mounted on /api/courses/:id/lessons in app.js or courseRoutes.js
// Wait, the requirement says: GET /api/courses/:id/lessons, POST /api/lessons, PUT /api/lessons/:id
// So we can mount this router in app.js as /api/lessons and also /api/courses/:id/lessons

// Let's handle POST /api/lessons and PUT /api/lessons/:id here directly
router.route('/')
  .post(protect, authorize('instructor'), createLesson);

router.route('/:id')
  .put(protect, authorize('instructor'), updateLesson);

// For GET /api/courses/:id/lessons, we will mount a separate path in app.js or use a specific route here
router.route('/course/:id')
  .get(getLessonsByCourse);

module.exports = router;
