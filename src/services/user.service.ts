import { AppDataSource } from '../database/appDataSource';
import { UserEntity } from '../database/entity/UserEntity';
import { PostEntity } from '../database/entity/PostEntity';
import { UserPayload } from 'user.types';
import { MESSAGES } from '../utils/messages';

export class UserService {
  private userRepository = AppDataSource.getRepository(UserEntity);
  private postRepository = AppDataSource.getRepository(PostEntity);

  constructor() {}

  public async getAllUsers(token: string | undefined) {
    const allUsers = await this.userRepository.find();
    return allUsers;
  }

  public async getUserDetails(id: string, userDecodedToken: UserPayload) {
    if (userDecodedToken.id !== id) {
      return { error: MESSAGES.UNAUTHORIZED };
    }

    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { posts: true },
    });

    return user;
  }

  public async deleteUser(id: string, userDecodedToken: UserPayload) {
    if (userDecodedToken.id !== id) {
      return { error: MESSAGES.UNAUTHORIZED };
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    const userPosts = await this.postRepository.findBy({ author: { id } });

    if (userPosts.length > 0) {
      const deletePostPromises = userPosts.map(post =>
        this.postRepository.delete({ id: post.id }),
      );
      await Promise.all(deletePostPromises);
    }

    return await this.userRepository.delete({ id });
  }
}
