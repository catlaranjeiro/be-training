import { AppDataSource } from '../database/appDataSource';
import { UserEntity } from '../database/entity/UserEntity';
import { PostEntity } from '../database/entity/PostEntity';
import { MESSAGES } from '../utils/messages';
import jwt from 'jsonwebtoken';

export class UserService {
  private userRepository = AppDataSource.getRepository(UserEntity);
  private postRepository = AppDataSource.getRepository(PostEntity);

  constructor() {}

  public async getAllUsers(token: string | undefined) {
    // ** 
    // recreate the authenticateRequest middleware to work with this class structure and run for every service or route?
    // src/middleware/authenticate-request.ts
    // **

    // if (!token) {

    //   console.log('No token')
    //   return MESSAGES.INVALID_TOKEN;
    // }

    // const decodedToken = jwt.verify(
    //   token,
    //   process.env.ACCESS_TOKEN_SECRET as string,
    // );
    
    // if (!decodedToken) {
    //   return MESSAGES.INVALID_TOKEN;
    // }

    const allUsers = await this.userRepository.find();
    return allUsers;
  }

  public async getUserDetails(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { posts: true },
    });

    return user;
  }

  public async deleteUser(id: string) {
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
