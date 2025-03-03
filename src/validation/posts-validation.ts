import { Schema } from 'express-validator';

export const create: Schema = {
  title: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'title cannot be empty',
    },
    isString: {
      errorMessage: 'title must be a string',
    },
    isLength: {
      errorMessage: 'title cannot be more than 25 characters',
      options: { max: 25 },
    },
  },
  description: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'description cannot be empty',
    },
    isString: {
      errorMessage: 'description must be a string',
    },
    isLength: {
      errorMessage: 'description cannot be more than 50 characters',
      options: { max: 50 },
    },
  },
  text: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'article cannot be empty',
    },
    isString: {
      errorMessage: 'article must be a string',
    },
  },
  authorId: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'authorId cannot be empty',
    },
    isString: {
      errorMessage: 'authorId must be a string',
    },
  },
};

export const edit: Schema = {
  title: {
    in: ['body'],
    optional: true,
    notEmpty: {
      errorMessage: 'title cannot be empty',
    },
    isString: {
      errorMessage: 'title must be a string',
    },
    isLength: {
      errorMessage: 'title cannot be more than 25 characters',
      options: { max: 25 },
    },
  },
  description: {
    in: ['body'],
    optional: true,
    notEmpty: {
      errorMessage: 'description cannot be empty',
    },
    isString: {
      errorMessage: 'description must be a string',
    },
    isLength: {
      errorMessage: 'description cannot be more than 50 characters',
      options: { max: 50 },
    },
  },
  text: {
    in: ['body'],
    optional: true,
    notEmpty: {
      errorMessage: 'article cannot be empty',
    },
    isString: {
      errorMessage: 'article must be a string',
    },
  },
};

const PostsValSchema = {
  create,
  edit,
};

export default PostsValSchema;
