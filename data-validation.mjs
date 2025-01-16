import {body} from 'express-validator'

export const addBirdValidator = [
  body('name', 'name is required').notEmpty(),
  body('name', 'name must be a string').isString().escape(),
  body('color', 'color is required').notEmpty(),
  body('color', 'color must be an array with values').isArray({ min: 1 }),
]

export const updateBirdValidator = [
  body('name', 'name must be a string').optional().isString().escape(),
  body('color', 'color must be an array with values').optional().isArray({ min: 1 }),
]