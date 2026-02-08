const Joi = require('joi');

/* ================= AUTH ================= */

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required()
    .messages({
      'string.min': 'Username too short',
      'any.required': 'Username required'
    }),

  email: Joi.string().trim().lowercase().email().required()
    .messages({
      'string.email': 'Invalid email',
      'any.required': 'Email required'
    }),

  password: Joi.string().min(6).max(100).required()
    .messages({
      'string.min': 'Password too short',
      'any.required': 'Password required'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required()
});

/* ================= GAMES ================= */

const betSchema = Joi.object({
  bet: Joi.number().min(1).max(100000).required()
});

/* Coinflip */
const coinflipSchema = Joi.object({
  bet: Joi.number().min(1).required(),
  choice: Joi.string().valid('heads', 'tails').required()
});

/* Roulette */
const rouletteSchema = Joi.object({
  bet: Joi.number().min(1).required(),
  type: Joi.string()
    .valid('number', 'color', 'evenOdd', 'highLow')
    .required(),
  value: Joi.alternatives().try(
    Joi.number(),
    Joi.string()
  ).required()
});

/* ================= USER ================= */

const updateProfileSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).optional(),
  email: Joi.string().trim().lowercase().email().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  betSchema,
  coinflipSchema,
  rouletteSchema,
  updateProfileSchema
};