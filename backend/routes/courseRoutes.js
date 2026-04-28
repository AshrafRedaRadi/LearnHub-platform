const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
} = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor'), updateCourse)
  .delete(protect, authorize('instructor'), deleteCourse);

// Enrollment
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;
