import { AppDataSource } from '../database/appDataSource';
import { UserEntity } from '../database/entity/UserEntity';
import { MESSAGES } from '../utils/messages';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(UserEntity);

  constructor() {}

  public async register(user: UserEntity) {
    const existingUser = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (existingUser) {
      return MESSAGES.USER_ALREADY_EXISTS;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const newUser = Object.assign(new UserEntity(), {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  public async login(email: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // need to explicitly select the password to compare it, because we don't select it by default on UserEntity
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      return MESSAGES.USER_NOT_FOUND;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return MESSAGES.INVALID_CREDENTIALS;
    }

    const userObj = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }

    const token = jwt.sign(
      userObj,
        process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '1h',
      },
    );

    return { token, user: userObj };
  }
}
