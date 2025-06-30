import { Request, Response } from 'express';
import { HTTP_STATUS } from "../../config/http-status";
import { PostService } from '../../services/posts.service';
import { MESSAGES } from '../../utils/messages';
import { validationResult } from 'express-validator';
import { ResponseParser } from '../../utils/response-parser';

export class PostsController {
  constructor(private readonly postService: PostService) {}

  public async getAllPosts(req: Request, res: Response) {
    const posts = await this.postService.getAllPosts();

    const responseParser = new ResponseParser();
    responseParser
      .setHttpCode(HTTP_STATUS.OK)
      .setStatus(true)
      .setMessage(MESSAGES.POST_FETCHED)
      .setBody(posts || {});

    return responseParser.send(res);
  }

  public async createPost(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(MESSAGES.VALIDATION_ERROR)
        .setBody(errors);

      return responseParser.send(res);
    }

    const newPost = await this.postService.createPost(req.body);

    if ('error' in newPost) {
      const responseParser = new ResponseParser();
      let statusCode = HTTP_STATUS.BAD_REQUEST;
      if (newPost.error === MESSAGES.POST_NOT_AUTHORIZED) {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
      }
     responseParser
        .setHttpCode(statusCode)
        .setStatus(false)
        .setMessage(newPost.error);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setHttpCode(HTTP_STATUS.CREATED)
      .setStatus(true)
      .setMessage(MESSAGES.POST_CREATED)
      .setBody(newPost);

    return responseParser.send(res);
  }

  public async getPostDetails(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(MESSAGES.VALIDATION_ERROR)
        .setBody(errors);

      return responseParser.send(res);
    }

    const postId = req.params.id;
    const post = await this.postService.getPostDetails(postId);
    
    if (!post) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.NOT_FOUND)
        .setStatus(false)
        .setMessage(MESSAGES.POST_NOT_FOUND);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.POST_FETCHED)
      .setBody(post);

    return responseParser.send(res);
  }

  public async updatePost(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(MESSAGES.VALIDATION_ERROR)
        .setBody(errors);

      return responseParser.send(res);
    }

    const postId = req.params.id;
    const post = await this.postService.getPostDetails(postId);

    if (!post) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.NOT_FOUND)
        .setStatus(false)
        .setMessage(MESSAGES.POST_NOT_FOUND);

      return responseParser.send(res);
    }

    const updatedPost = await this.postService.updatePost(postId, req.body);

    if ('error' in updatedPost) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(updatedPost.error);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.POST_UPDATED)
      .setBody(updatedPost);

    return responseParser.send(res);
  }

  public async deletePost(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(MESSAGES.VALIDATION_ERROR)
        .setBody(errors);

      return responseParser.send(res);
    }
    
    const postId = req.params.id;
    const deletedPost = await this.postService.deletePost(postId);

    if (!deletedPost) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.NOT_FOUND)
        .setStatus(false)
        .setMessage(MESSAGES.POST_NOT_FOUND);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.POST_DELETED)
      .setBody(deletedPost);

    return responseParser.send(res);
  }
}
