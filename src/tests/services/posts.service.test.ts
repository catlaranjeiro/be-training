import { PostService } from '../../services/posts.service';
import { AppDataSource } from '../../database/appDataSource';
import { PostEntity } from '../../database/entity/PostEntity';
import { UserEntity } from '../../database/entity/UserEntity';
import { MESSAGES } from '../../utils/messages';

jest.mock('../../database/appDataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockedGetRepository = AppDataSource.getRepository as jest.Mock;

describe('PostService', () => {
  let postService: PostService;
  let postRepository: any;
  let userRepository: any;

  const mockPost = {
    id: 'post-uuid-1',
    title: 'Test Post',
    description: 'A test post.',
    text: 'Some text here.',
    authorId: 'user-uuid-1',
    tags: ['test', 'mock'],
  };

  const mockUser = {
    id: 'user-uuid-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    postRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userRepository = {
      findOneBy: jest.fn(),
    };
    mockedGetRepository.mockImplementation((entity: any) => {
      if (entity === PostEntity) {
        return postRepository;
      }
      if (entity === UserEntity) {
        return userRepository;
      }
    });
    postService = new PostService();
  });

  it('getAllPosts should return all posts', async () => {
    postRepository.find.mockResolvedValue([mockPost]);
    const posts = await postService.getAllPosts();
    expect(posts).toEqual([mockPost]);
    expect(postRepository.find).toHaveBeenCalledTimes(1);
  });

  describe('createPost', () => {
    it('should create and return a new post', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      postRepository.save.mockResolvedValue(mockPost);

      const newPost = await postService.createPost(mockPost);
      expect(newPost).toHaveProperty('title', mockPost.title);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: mockPost.authorId });
      expect(postRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return an error if author is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      const result = await postService.createPost(mockPost);
      expect(result).toEqual({ error: MESSAGES.POST_AUTHOR_NOT_FOUND });
    });
  });

  it('getPostDetails should return a post if found', async () => {
    postRepository.findOne.mockResolvedValue(mockPost);
    const post = await postService.getPostDetails('post-uuid-1');
    expect(post).toEqual(mockPost);
    expect(postRepository.findOne).toHaveBeenCalledWith({ where: { id: 'post-uuid-1' } });
  });

  describe('updatePost', () => {
    it('should update a post if found', async () => {
        const updateData = { 
            title: 'Updated Title',
            description: 'Updated description',
            text: 'Updated text',
            tags: ['updated']
        };
        postRepository.findOneBy.mockResolvedValue(mockPost);
        postRepository.update.mockResolvedValue({ affected: 1 });
  
        const result = await postService.updatePost('post-uuid-1', updateData);
        expect(result).not.toHaveProperty('error');
        expect(postRepository.findOneBy).toHaveBeenCalledWith({ id: 'post-uuid-1' });
        expect(postRepository.update).toHaveBeenCalledWith('post-uuid-1', updateData);
      });
  
      it('should return an error if post to update is not found', async () => {
        postRepository.findOneBy.mockResolvedValue(null);
        const result = await postService.updatePost('post-uuid-1', {} as any);
        expect(result).toEqual({ error: MESSAGES.POST_NOT_FOUND });
      });
  })

  describe('deletePost', () => {
    it('should delete a post if found', async () => {
        postRepository.findOneBy.mockResolvedValue(mockPost);
        postRepository.delete.mockResolvedValue({ affected: 1 });
        const result = await postService.deletePost('post-uuid-1');
        expect(result).not.toBeNull();
      });
    
      it('should return null if post to delete is not found', async () => {
        postRepository.findOneBy.mockResolvedValue(null);
        const result = await postService.deletePost('post-uuid-1');
        expect(result).toBeNull();
      });
  })

}); 