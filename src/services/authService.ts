import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import { RegisterDTO, LoginDTO, UserWithoutPassword } from '../types/dto.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDTO): Promise<UserWithoutPassword> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.userRepository.create({
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    return generateTokens(user.id);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId } = verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestError('Invalid refresh token');
    }

    return generateTokens(userId);
  }
}

