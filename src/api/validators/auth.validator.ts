import { Schema } from 'express-validator';

export const register: Schema = {
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
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'password cannot be empty',
    },
    isLength: {
      errorMessage: 'password must be at least 8 characters long',
      options: { min: 8 },
    },
  },
};

export const login: Schema = {
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'email cannot be empty',
    },
    isEmail: {
      errorMessage: 'Invalid email',
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'password cannot be empty',
    },
  },
};

export const logout: Schema = {};

const AuthValSchema = {
  register,
  login,
};

export default AuthValSchema;
