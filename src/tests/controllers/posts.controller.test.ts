import { PostsController } from '../../api/controllers/posts.controller';
import { PostService } from '../../services/posts.service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ResponseParser } from '../../utils/response-parser';

// Mocking dependencies
jest.mock('../../services/posts.service');
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

const MockedPostService = PostService as jest.MockedClass<typeof PostService>;
const mockedValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;

describe('PostsController', () => {
    let postsController: PostsController;
    let mockPostService: jest.Mocked<PostService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockResponseParser: any;

    const mockPost = {
        id: 'post-uuid-1',
        title: 'Test Post',
        description: 'A test post.',
        text: 'Some text here.',
        publishedAt: new Date(),
        tags: ['test'],
        author: { id: 'user-uuid-1', firstName: 'John', lastName: 'Doe', email: 'john@doe.com' },
      } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPostService = new MockedPostService() as jest.Mocked<PostService>;
        postsController = new PostsController(mockPostService);

        mockRequest = { body: {}, params: {} };
        mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockResponseParser = new (ResponseParser as any)();
        (ResponseParser as any).mockImplementation(() => mockResponseParser);
    });

    it('getAllPosts should fetch and return posts', async () => {
        mockPostService.getAllPosts.mockResolvedValue([mockPost]);
        await postsController.getAllPosts(mockRequest as Request, mockResponse as Response);
        expect(mockResponseParser.setBody).toHaveBeenCalledWith([mockPost]);
        expect(mockResponseParser.send).toHaveBeenCalledWith(mockResponse);
    });

    describe('createPost', () => {
        it('should handle validation errors', async () => {
            const errors = { isEmpty: () => false, array: () => ['validation error'] };
            mockedValidationResult.mockReturnValue(errors as any);
            await postsController.createPost(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setStatus).toHaveBeenCalledWith(false);
            expect(mockResponseParser.setBody).toHaveBeenCalledWith(errors);
            expect(mockResponseParser.send).toHaveBeenCalledTimes(1);
        });

        it('should create a post and return 201 status', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.body = { title: 'New Post' };
            mockPostService.createPost.mockResolvedValue(mockPost);
            await postsController.createPost(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(201);
            expect(mockResponseParser.setBody).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('getPostDetails', () => {
        it('should return 404 if post not found', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.params = { id: 'non-existent-uuid' };
            mockPostService.getPostDetails.mockResolvedValue(null);
            await postsController.getPostDetails(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(404);
        });

        it('should return post details if found', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.params = { id: 'post-uuid-1' };
            mockPostService.getPostDetails.mockResolvedValue(mockPost);
            await postsController.getPostDetails(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setBody).toHaveBeenCalledWith(mockPost);
            expect(mockResponseParser.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('updatePost', () => {
        it('should return 404 if post to update is not found', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.params = { id: 'non-existent-uuid' };
            mockPostService.getPostDetails.mockResolvedValue(null); // First check
            await postsController.updatePost(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(404);
          });
      
          it('should update a post and return the updated data', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.params = { id: 'post-uuid-1' };
            mockRequest.body = { title: 'Updated Title' };
            mockPostService.getPostDetails.mockResolvedValue(mockPost); // Check before update
            mockPostService.updatePost.mockResolvedValue({ affected: 1 } as any);
            await postsController.updatePost(mockRequest as Request, mockResponse as Response);
            expect(mockPostService.updatePost).toHaveBeenCalledWith('post-uuid-1', mockRequest.body);
            expect(mockResponseParser.setBody).toHaveBeenCalledWith({ affected: 1 });
          });
    })
    
    describe('deletePost', () => {
        it('should return 404 if post to delete is not found', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.params = { id: 'non-existent-uuid' };
            mockPostService.deletePost.mockResolvedValue(null);
            await postsController.deletePost(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setHttpCode).toHaveBeenCalledWith(404);
        });
    
        it('should delete a post and return the deleted data', async () => {
            mockedValidationResult.mockReturnValue({ isEmpty: () => true } as any);
            mockRequest.params = { id: 'post-uuid-1' };
            mockPostService.deletePost.mockResolvedValue({ affected: 1 } as any);
            await postsController.deletePost(mockRequest as Request, mockResponse as Response);
            expect(mockResponseParser.setBody).toHaveBeenCalledWith({ affected: 1 });
        });
    });
}); 