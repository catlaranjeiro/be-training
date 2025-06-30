import { Schema } from 'express-validator';

const details: Schema = {
  id: {
    in: ['params'],
    isUUID: {
      errorMessage: 'id must be a valid UUID',
    },
  },
};

const UserValSchema = {
  details,
};

export default UserValSchema;