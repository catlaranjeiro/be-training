import { UsersController } from '../../api/controllers/users.controller';
import { UserService } from '../../services/user.service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ResponseParser } from '../../utils/response-parser';
import { UserPayload } from '../../types/user.types';
import { MESSAGES } from '../../utils/messages';
import { UserEntity } from '../../database/entity/UserEntity';

// Mock Dependencies
jest.mock('../../services/user.service');
jest.mock('express-validator');
jest.mock('../../utils/response-parser', () => ({
  ResponseParser: jest.fn().mockImplementation(() => ({
    setHttpCode: jest.fn().mockReturnThis(),
    setStatus: jest.fn().mockReturnThis(),
    setMessage: jest.fn().mockReturnThis(),
    setBody: jest.fn().mockReturnThis(),
    send: jest.fn(),
  })),
}));

const MockedUserService = UserService as jest.MockedClass<typeof UserService>;
const mockedValidationResult = validationResult as jest.MockedFunction<
  typeof validationResult
>;

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockResponseParser: any;

  // Mock Data
  const userPayload: UserPayload = {
    id: 'user-uuid-1',
    email: 'john@doe.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockUser: UserEntity = {
    ...userPayload,
    posts: [],
    created_at: new Date(),
    updated_at: new Date(),
    password: 'hashedpassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Mocks
    mockUserService = new MockedUserService() as jest.Mocked<UserService>;
    usersController = new UsersController(mockUserService);

    mockRequest = {
      params: {},
      body: {},
      user: userPayload,
      token: 'mock-jwt-token',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockResponseParser = new (ResponseParser as any)();
    (ResponseParser as any).mockImplementation(() => mockResponseParser);
  });

  describe('getAllUsers', () => {
    it('should fetch and return all users successfully', async () => {
      mockUserService.getAllUsers.mockResolvedValue([mockUser]);
      await usersController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(mockRequest.token);
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.USERS_FETCHED,
      );
      expect(mockResponseParser.setBody).toHaveBeenCalledWith([mockUser]);
      expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should return an empty array if the service returns an empty array', async () => {
      mockUserService.getAllUsers.mockResolvedValue([]);
      await usersController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.USERS_FETCHED,
      );
      expect(mockResponseParser.setBody).toHaveBeenCalledWith([]);
      expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getUserDetails', () => {
    beforeEach(() => {
        mockRequest.params = { id: 'user-uuid-1' };
        mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
      });

    it('should return validation errors if they exist', async () => {
        const errors = { isEmpty: () => false, array: () => ['error'] };
        mockedValidationResult.mockReturnValue(errors as any);
        await usersController.getUserDetails(mockRequest as Request, mockResponse as Response);
        expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(400);
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.VALIDATION_ERROR);
    });

    it('should get and return user details successfully', async () => {
      mockUserService.getUserDetails.mockResolvedValue(mockUser);
      await usersController.getUserDetails(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockUserService.getUserDetails).toHaveBeenCalledWith(
        'user-uuid-1',
        userPayload,
      );
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.USER_DETAILS_FETCHED,
      );
      expect(mockResponseParser.setBody).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      mockUserService.getUserDetails.mockResolvedValue(null);
      await usersController.getUserDetails(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(404);
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.USER_NOT_FOUND,
      );
    });

    it('should return 401 if service returns an authorization error', async () => {
      mockUserService.getUserDetails.mockResolvedValue({
        error: MESSAGES.UNAUTHORIZED,
      });
      await usersController.getUserDetails(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(401);
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.UNAUTHORIZED,
      );
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
        mockRequest.params = { id: 'user-uuid-1' };
        mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
      });

    it('should delete a user and return a success message', async () => {
      const deleteResult = { affected: 1, raw: {} };
      mockUserService.deleteUser.mockResolvedValue(deleteResult);
      await usersController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(
        'user-uuid-1',
        userPayload,
      );
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.USER_DELETED,
      );
      expect(mockResponseParser.setBody).toHaveBeenCalledWith(deleteResult);
    });

    it('should return 404 if user to delete is not found', async () => {
      mockUserService.deleteUser.mockResolvedValue(null);
      await usersController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(404);
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.USER_NOT_FOUND,
      );
    });

    it('should return 401 if service returns an authorization error', async () => {
      mockUserService.deleteUser.mockResolvedValue({
        error: MESSAGES.UNAUTHORIZED,
      });
      await usersController.deleteUser(
        mockRequest as Request,
        mockResponse as Response,
      );
      expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(401);
      expect(mockResponseParser.setMessage).toHaveBeenCalledWith(
        MESSAGES.UNAUTHORIZED,
      );
    });
  });
}); 