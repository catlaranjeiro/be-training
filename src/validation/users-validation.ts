import { Schema } from 'express-validator';

export const create: Schema = {
  firstName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'firstName cannot be empty',
    },
    isString: {
      errorMessage: 'firstName must be a string',
    },
    isLength: {
      errorMessage: 'firstName cannot be more than 30 characters',
      options: { max: 30 },
    },
  },
  lastName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'lastName cannot be empty',
    },
    isString: {
      errorMessage: 'lastName must be a string',
    },
    isLength: {
      errorMessage: 'lastName cannot be more than 30 characters',
      options: { max: 30 },
    },
  },
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'email cannot be empty',
    },
    isEmail: {
      errorMessage: 'Invalid email',
    },
  },
};


const UsersValSchema = {
  create,
};

export default UsersValSchema;
