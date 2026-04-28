const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  image: Joi.string().uri().optional().allow(''),
  rating: Joi.number().min(0).max(5).optional()
});

const updateCourseSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().optional(),
  image: Joi.string().uri().optional().allow(''),
  rating: Joi.number().min(0).max(5).optional()
});

module.exports = {
  createCourseSchema,
  updateCourseSchema
};
