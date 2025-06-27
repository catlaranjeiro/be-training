import { MESSAGES } from '../utils/messages';
import { AppDataSource } from '../database/appDataSource';
import { PostEntity } from '../database/entity/PostEntity';
import { UserEntity } from '../database/entity/UserEntity';

export class PostService {
  private postRepository = AppDataSource.getRepository(PostEntity);
  private userRepository = AppDataSource.getRepository(UserEntity);

  constructor() {}

  public async getAllPosts() {
    const allPosts = await this.postRepository.find();
    return allPosts;
  }

  public async createPost(body: {
    title: string;
    description: string;
    text: string;
    authorId: string;
    tags: string[];
  }) {
    const { title, description, text, authorId, tags } = body;

    const author = await this.userRepository.findOneBy({ id: authorId });

    if (!author) {
      return { error: MESSAGES.POST_AUTHOR_NOT_FOUND };
    }

    // Assert req.user is defined and has the expected type (UserPayload)
    // The authenticateRequestMiddleware ensures that req.user is set.
    // if (author.id !== req.user!.id) {
    //   res
    //     .status(403)
    //     .json({
    //       status: 'error',
    //       message: 'You are not authorized to create a post for this author',
    //     });
    //   return;
    // }

    const newPostObj = Object.assign(new PostEntity(), {
      title,
      description,
      text,
      tags: tags || [],
      author,
      publishedAt: new Date(),
    });

    const newPost = await this.postRepository.save(newPostObj);

    return newPost;
  }

  public async getPostDetails(id: string) {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });

    return post;
  }

  public async updatePost(
    id: string,
    body: {
      title: string;
      description: string;
      text: string;
      tags: string[];
    },
  ) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      return { error: MESSAGES.POST_NOT_FOUND };
    }

    // Assert req.user is defined and has the expected type (UserPayload)
    // The authenticateRequestMiddleware ensures that req.user is set.
    // if (author.id !== req.user!.id) {
    //   res
    //     .status(403)
    //     .json({
    //       status: 'error',
    //       message: 'You are not authorized to create a post for this author',
    //     });
    //   return;
    // }

    return await this.postRepository.update(id, body);
  }

  public async deletePost(id: string) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      return null;
    }

    return await this.postRepository.delete({ id });
  }
}
