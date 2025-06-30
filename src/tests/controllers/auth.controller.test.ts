import { AuthController } from '../../api/controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MESSAGES } from '../../utils/messages';
import { ResponseParser } from '../../utils/response-parser';

// Mocking dependencies
jest.mock('../../services/auth.service');
jest.mock('express-validator');
jest.mock('../../utils/response-parser', () => {
    const originalModule = jest.requireActual('../../utils/response-parser');
    return {
      ...originalModule,
      ResponseParser: jest.fn().mockImplementation(() => ({
        setHttpCode: jest.fn().mockReturnThis(),
        setStatus: jest.fn().mockReturnThis(),
        setMessage: jest.fn().mockReturnThis(),
        setBody: jest.fn().mockReturnThis(),
        send: jest.fn(),
      })),
    };
  });
  

const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const mockedValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;
const MockedResponseParser = ResponseParser as jest.MockedClass<typeof ResponseParser>;


describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockResponseParser: any;


  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService = new MockedAuthService() as jest.Mocked<AuthService>;
    authController = new AuthController(mockAuthService);

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockResponseParser = new (ResponseParser as any)();
    (ResponseParser as any).mockImplementation(() => mockResponseParser);
  });

  describe('register', () => {
    it('should return validation errors if request is invalid', async () => {
        const errors = { isEmpty: () => false, array: () => ['validation error'] };
        mockedValidationResult.mockReturnValue(errors as any);

        await authController.register(mockRequest as Request, mockResponse as Response);
      
        expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(400);
        expect(mockResponseParser.setStatus).toHaveBeenCalledWith(false);
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.VALIDATION_ERROR);
        expect(mockResponseParser.setBody).toHaveBeenCalledWith(errors.array());
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should return 400 if user already exists', async () => {
        mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
        mockRequest.body = { email: 'test@test.com', password: 'password' };
        mockAuthService.register.mockResolvedValue(MESSAGES.USER_ALREADY_EXISTS);
      
        await authController.register(mockRequest as Request, mockResponse as Response);
      
        expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(400);
        expect(mockResponseParser.setStatus).toHaveBeenCalledWith(false);
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.USER_ALREADY_EXISTS);
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });
      

    it('should register a user and return 201', async () => {
        mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
        const userData = { firstName: 'New', lastName: 'User', email: 'new@test.com', password: 'password' };
        const createdUser = { id: '1', ...userData };
        mockRequest.body = userData;
        mockAuthService.register.mockResolvedValue(createdUser as any);

        await authController.register(mockRequest as Request, mockResponse as Response);

        expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(201);
        expect(mockResponseParser.setStatus).toHaveBeenCalledWith(true);
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.USER_CREATED);
        expect(mockResponseParser.setBody).toHaveBeenCalledWith(createdUser);
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('login', () => {
    it('should return validation errors if request is invalid', async () => {
        const errors = { isEmpty: () => false, array: () => ['validation error'] };
        mockedValidationResult.mockReturnValue(errors as any);

        await authController.login(mockRequest as Request, mockResponse as Response);

        expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(400);
        expect(mockResponseParser.setStatus).toHaveBeenCalledWith(false);
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.VALIDATION_ERROR);
        expect(mockResponseParser.setBody).toHaveBeenCalledWith(errors);
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should return 401 for invalid credentials', async () => {
        mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
        mockRequest.body = { email: 'wrong@test.com', password: 'wrong' };
        mockAuthService.login.mockResolvedValue(MESSAGES.INVALID_CREDENTIALS);

        await authController.login(mockRequest as Request, mockResponse as Response);

        expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(401);
        expect(mockResponseParser.setStatus).toHaveBeenCalledWith(false);
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.INVALID_CREDENTIALS);
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should login a user and return a token', async () => {
        mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
        const loginData = { email: 'test@test.com', password: 'password' };
        const loginResult = { token: 'somejwttoken', user: { id: '1', email: loginData.email, firstName: 'Test', lastName: 'User' } };
        mockRequest.body = loginData;
        mockAuthService.login.mockResolvedValue(loginResult);
      
        // Add the necessary message to MESSAGES
        MESSAGES.LOGIN_SUCCESS = 'Login successful';
      
        await authController.login(mockRequest as Request, mockResponse as Response);
      
        expect(mockResponseParser.setMessage).toHaveBeenCalledWith(MESSAGES.LOGIN_SUCCESS);
        expect(mockResponseParser.setBody).toHaveBeenCalledWith(loginResult);
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
      });
      
  });
}); 