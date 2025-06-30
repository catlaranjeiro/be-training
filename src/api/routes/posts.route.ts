import { Router, Request, Response } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { PostService } from '../../services/posts.service';
import { checkSchema } from 'express-validator';
import PostValSchema from '../validators/post.validator';

class PostsRoute {
  public router: Router = Router();
  private postController: PostsController;

  constructor() {
    this.postController = new PostsController(new PostService());
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', (req: Request, res: Response) => {
      this.postController.getAllPosts(req, res);
    });

    this.router.get('/:id', checkSchema(PostValSchema.details), (req: Request, res: Response) => {
      this.postController.getPostDetails(req, res);
    });
    
    this.router.post('/', checkSchema(PostValSchema.create), (req: Request, res: Response) => {
      this.postController.createPost(req, res);
    });

    this.router.put('/:id', checkSchema(PostValSchema.edit), (req: Request, res: Response) => {
      this.postController.updatePost(req, res);
    });

    this.router.delete('/:id', checkSchema(PostValSchema.details), (req: Request, res: Response) => {
      this.postController.deletePost(req, res);
    });
  }
}

export default new PostsRoute().router;
