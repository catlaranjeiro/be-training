import { AuthService } from '../../services/auth.service';
import { UserEntity } from '../../database/entity/UserEntity';
import { AppDataSource } from '../../database/appDataSource';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MESSAGES } from '../../utils/messages';

// Mocking dependencies
jest.mock('../../database/appDataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOneBy: jest.fn(),
      save: jest.fn(),
    }),
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Set a dummy secret for JWT to be used in tests
process.env.ACCESS_TOKEN_SECRET = 'test-secret';

const mockedGetRepository = AppDataSource.getRepository as jest.Mock;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: any;
  let mockQueryBuilder: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    mockQueryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    userRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    mockedGetRepository.mockReturnValue(userRepository);
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      } as UserEntity;
      const hashedPassword = 'hashedPassword';
      const savedUser = {
        id: 'uuid-1',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
      };

      userRepository.findOneBy.mockResolvedValue(null);
      (mockedBcrypt.genSalt as jest.Mock).mockResolvedValue('a-salt-value');
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      userRepository.save.mockResolvedValue(savedUser);

      const result = await authService.register(userData);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: userData.email });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 'a-salt-value');
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(UserEntity));
      expect(result).toEqual(savedUser);
    });

    it('should return a message if user already exists', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      } as UserEntity;
      userRepository.findOneBy.mockResolvedValue({
        id: 'uuid-2',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: 'someotherhashedpassword',
      });

      const result = await authService.register(userData);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: userData.email });
      expect(result).toBe(MESSAGES.USER_ALREADY_EXISTS);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = {
      id: 'uuid-1',
      email,
      password: 'hashedPassword',
    };

    it('should return a token for valid credentials', async () => {
      const token = 'test-token';
      const userPayload = { id: user.id, email: user.email };
      mockQueryBuilder.getOne.mockResolvedValue(user);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockedJwt.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.login(email, password);

      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(mockedJwt.sign).toHaveBeenCalledWith(expect.objectContaining(userPayload), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });

    it('should return user not found message if user not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      const result = await authService.login(email, password);

      expect(result).toBe(MESSAGES.USER_NOT_FOUND);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return invalid credentials message for wrong password', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(user);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login(email, password);

      expect(result).toBe(MESSAGES.INVALID_CREDENTIALS);
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });
  });
}); 