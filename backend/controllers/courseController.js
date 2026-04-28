const Course = require('../models/Course');
const { createCourseSchema, updateCourseSchema } = require('../validations/courseValidation');
const { getDefaultCourseImage, ensureCourseImage } = require('../utils/courseImageDefaults');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    // Build a dynamic filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    const courses = await Course.find(filter).populate('instructor', 'name email');
    const data = courses.map((c) => ensureCourseImage(c));
    res.status(200).json({
      success: true,
      data,
      message: 'Courses fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    res.status(200).json({
      success: true,
      data: ensureCourseImage(course),
      message: 'Course fetched successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      return next(new Error('Course not found'));
    }
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res, next) => {
  try {
    const { error } = createCourseSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // Add instructor to req.body
    req.body.instructor = req.user.id;

    if (!req.body.image || !String(req.body.image).trim()) {
      req.body.image = getDefaultCourseImage(req.body.category);
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: ensureCourseImage(course),
      message: 'Course created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res, next) => {
  try {
    const { error } = updateCourseSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Make sure user is course instructor
    if (course.instructor.toString() !== req.user.id) {
      res.status(403);
      throw new Error('User not authorized to update this course');
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'image')) {
      const img = req.body.image;
      if (img == null || (typeof img === 'string' && !img.trim())) {
        req.body.image = getDefaultCourseImage(
          req.body.category || course.category
        );
      }
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: ensureCourseImage(course),
      message: 'Course updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Make sure user is course instructor
    if (course.instructor.toString() !== req.user.id) {
      res.status(403);
      throw new Error('User not authorized to delete this course');
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res, next) => {
  try {
    const User = require('../models/User');

    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if already enrolled — query directly to avoid loading password
    const alreadyEnrolled = await User.exists({
      _id: req.user.id,
      enrolledCourses: req.params.id
    });

    if (alreadyEnrolled) {
      res.status(400);
      throw new Error('Already enrolled in this course');
    }

    // Use $addToSet on both documents to avoid duplicates.
    // Using findByIdAndUpdate bypasses Mongoose validators (including the
    // password match regex) which would otherwise reject the stored bcrypt hash.
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { enrolledCourses: req.params.id } },
      { new: true }
    );

    await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: req.user.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: { courseId: req.params.id },
      message: 'Enrolled successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse
};
