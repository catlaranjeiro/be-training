import { UserService } from '../../services/user.service';
import { AppDataSource } from '../../database/appDataSource';
import { PostEntity } from '../../database/entity/PostEntity';
import { UserEntity } from '../../database/entity/UserEntity';
import { MESSAGES } from '../../utils/messages';
import { UserPayload } from '../../types/user.types';

jest.mock('../../database/appDataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockedGetRepository = AppDataSource.getRepository as jest.Mock;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: any;
  let postRepository: any;

  const mockUser = {
    id: 'user-uuid-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
  };

  const userPayload: UserPayload = { id: 'user-uuid-1', email: 'john@doe.com', firstName: 'John', lastName: 'Doe' };

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };
    postRepository = {
      findBy: jest.fn(),
      delete: jest.fn(),
    };
    mockedGetRepository.mockImplementation((entity: any) => {
      if (entity === UserEntity) return userRepository;
      if (entity === PostEntity) return postRepository;
    });
    userService = new UserService();
  });

  it('getAllUsers should return all users without passwords', async () => {
    userRepository.find.mockResolvedValue([mockUser]);
    const users = await userService.getAllUsers('some-token');
    expect(users).toEqual([mockUser]);
    expect(userRepository.find).toHaveBeenCalledWith({
        select: { id: true, firstName: true, lastName: true, email: true },
    });
  });

  describe('getUserDetails', () => {
    it('should return user details if ID matches token', async () => {
        userRepository.findOne.mockResolvedValue(mockUser);
        const result = await userService.getUserDetails('user-uuid-1', userPayload);
        expect(result).toEqual(mockUser);
      });
  
      it('should return unauthorized error if ID does not match token', async () => {
        const result = await userService.getUserDetails('user-uuid-2', userPayload);
        expect(result).toEqual({ error: MESSAGES.UNAUTHORIZED });
      });
  })

  describe('deleteUser', () => {
    it('should return unauthorized if ID does not match token', async () => {
        const result = await userService.deleteUser('user-uuid-2', userPayload);
        expect(result).toEqual({ error: MESSAGES.UNAUTHORIZED });
      });
  
      it('should return null if user to delete is not found', async () => {
        userRepository.findOneBy.mockResolvedValue(null);
        const result = await userService.deleteUser('user-uuid-1', userPayload);
        expect(result).toBeNull();
      });

      it('should delete user and their posts if found', async () => {
        const mockUserPosts = [{ id: 'post-uuid-1' }, { id: 'post-uuid-2' }];
        userRepository.findOneBy.mockResolvedValue(mockUser);
        postRepository.findBy.mockResolvedValue(mockUserPosts);
        userRepository.delete.mockResolvedValue({ affected: 1 });
    
        await userService.deleteUser('user-uuid-1', userPayload);
    
        expect(postRepository.findBy).toHaveBeenCalledWith({ author: { id: 'user-uuid-1' } });
        expect(postRepository.delete).toHaveBeenCalledTimes(mockUserPosts.length);
        expect(userRepository.delete).toHaveBeenCalledWith({ id: 'user-uuid-1' });
      });
  })

}); 