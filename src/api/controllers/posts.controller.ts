import { Request, Response } from 'express';
import { HTTP_STATUS } from "../../config/http-status";
import { PostService } from '../../services/posts.service';
import { MESSAGES } from '../../utils/messages';
import { validationResult } from 'express-validator';

export class PostsController {
  constructor(private readonly postService: PostService) {}

  public async getAllPosts(req: Request, res: Response) {
    const posts = await this.postService.getAllPosts();

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: posts || {},
    });
  }

  public async createPost(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: errors,
      });
    }

    const newPost = await this.postService.createPost(req.body);

    if ('error' in newPost) {
      let statusCode = HTTP_STATUS.BAD_REQUEST;
      if (newPost.error === MESSAGES.POST_NOT_AUTHORIZED) {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
      }
      return res.status(statusCode).json({
        status: 'error',
        message: newPost.error,
      });
    }

    return res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: MESSAGES.POST_CREATED,
      data: newPost,
    });
  }

  public async getPostDetails(req: Request, res: Response) {
    const postId = req.params.id;
    const post = await this.postService.getPostDetails(postId);
    
    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: MESSAGES.POST_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: post,
    });
  }

  public async updatePost(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: errors,
      });
    }

    const postId = req.params.id;
    const post = await this.postService.getPostDetails(postId);

    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: MESSAGES.POST_NOT_FOUND,
      });
    }

    const updatedPost = await this.postService.updatePost(postId, req.body);

    if ('error' in updatedPost) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: updatedPost.error,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: MESSAGES.POST_UPDATED,
      data: updatedPost,
    });
  }

  public async deletePost(req: Request, res: Response) {
    const postId = req.params.id;
    const deletedPost = await this.postService.deletePost(postId);

    if (!deletedPost) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: MESSAGES.POST_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: MESSAGES.POST_DELETED,
      data: deletedPost,
    });
  }
}
