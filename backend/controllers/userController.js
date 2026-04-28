const User = require('../models/User');
const { ensureCourseImage } = require('../utils/courseImageDefaults');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'title description image price rating category instructor students');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const payload = user.toObject();
    payload.enrolledCourses = (payload.enrolledCourses || []).map((c) =>
      ensureCourseImage(c)
    );

    res.status(200).json({
      success: true,
      data: payload,
      message: 'Profile fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const updateFields = {};

    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;

    // Build the update object
    const updateOps = {};
    if (Object.keys(updateFields).length > 0) {
      updateOps.$set = updateFields;
    }

    // Enroll in a course (legacy support)
    if (req.body.enrollCourseId) {
      updateOps.$addToSet = updateOps.$addToSet || {};
      updateOps.$addToSet.enrolledCourses = req.body.enrollCourseId;
    }

    // Mark a lesson as completed
    if (req.body.completedLessonId) {
      const User = require('../models/User');
      // Check if lesson progress entry already exists
      const existing = await User.findOne({
        _id: req.user.id,
        'progress.lesson': req.body.completedLessonId
      });

      if (existing) {
        // Update the existing progress entry
        await User.findOneAndUpdate(
          { _id: req.user.id, 'progress.lesson': req.body.completedLessonId },
          { $set: { 'progress.$.completed': true } }
        );
      } else {
        // Push a new progress entry
        updateOps.$push = { progress: { lesson: req.body.completedLessonId, completed: true } };
      }
    }

    const User = require('../models/User');
    // findByIdAndUpdate bypasses Mongoose validators (avoids bcrypt hash failing password regex)
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      Object.keys(updateOps).length > 0 ? updateOps : { $set: {} },
      { new: true, runValidators: false }
    ).populate('enrolledCourses', 'title description image price rating category');

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    const enrolled = (updatedUser.enrolledCourses || []).map((c) =>
      ensureCourseImage(c)
    );

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        enrolledCourses: enrolled,
        progress: updatedUser.progress
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
