const Joi = require('joi');

const createLessonSchema = Joi.object({
  title: Joi.string().required(),
  videoUrl: Joi.string().required(),
  duration: Joi.number().min(0).required(),
  order: Joi.number().min(1).required(),
  isLocked: Joi.boolean().optional(),
  courseId: Joi.string().required() // usually passed in body or params, let's allow it in body
});

const updateLessonSchema = Joi.object({
  title: Joi.string().optional(),
  videoUrl: Joi.string().optional(),
  duration: Joi.number().min(0).optional(),
  order: Joi.number().min(1).optional(),
  isLocked: Joi.boolean().optional()
});

module.exports = {
  createLessonSchema,
  updateLessonSchema
};
