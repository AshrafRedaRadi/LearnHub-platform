const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { createLessonSchema, updateLessonSchema } = require('../validations/lessonValidation');

// @desc    Get lessons for a course
// @route   GET /api/courses/:id/lessons
// @access  Public
const getLessonsByCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id; // from course route
    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: lessons,
      message: 'Lessons fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a lesson
// @route   POST /api/lessons
// @access  Private/Instructor
const createLesson = async (req, res, next) => {
  try {
    const { error } = createLessonSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.instructor.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to add a lesson to this course');
    }

    const lesson = await Lesson.create(req.body);

    res.status(201).json({
      success: true,
      data: lesson,
      message: 'Lesson created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private/Instructor
const updateLesson = async (req, res, next) => {
  try {
    const { error } = updateLessonSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      res.status(404);
      throw new Error('Lesson not found');
    }

    const course = await Course.findById(lesson.courseId);
    
    if (course.instructor.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this lesson');
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lesson,
      message: 'Lesson updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessonsByCourse,
  createLesson,
  updateLesson
};
