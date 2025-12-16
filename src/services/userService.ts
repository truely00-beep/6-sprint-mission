import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/userRepository.js';
import { UpdateMeDTO, UpdatePasswordDTO, UserWithoutPassword, PageParams, ProductListResponse } from '../types/dto.js';
import { ProductRepository, ProductWithFavoritesRelation } from '../repositories/productRepository.js';
import { FavoriteRepository } from '../repositories/favoriteRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { ProductWithFavorites } from '../types/dto.js';

export class UserService {
  private userRepository: UserRepository;
  private productRepository: ProductRepository;
  private favoriteRepository: FavoriteRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.productRepository = new ProductRepository();
    this.favoriteRepository = new FavoriteRepository();
  }

  async getMe(userId: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('user', userId);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateMe(userId: number, data: UpdateMeDTO): Promise<UserWithoutPassword> {
    const updatedUser = await this.userRepository.update(userId, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updatePassword(userId: number, data: UpdatePasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('user', userId);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    await this.userRepository.updatePassword(userId, hashedPassword);
  }

  async getMyProductList(userId: number, params: PageParams): Promise<ProductListResponse> {
    const { products, totalCount } = await this.productRepository.findMany({
      ...params,
      userId,
    });

    const productsWithFavorites: ProductWithFavorites[] = products.map((product) => ({
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: product.favorites.some((favorite) => favorite.userId === userId),
    }));

    return {
      list: productsWithFavorites,
      totalCount,
    };
  }

  async getMyFavoriteList(userId: number, params: PageParams): Promise<ProductListResponse> {
    const { products, totalCount } = await this.favoriteRepository.findProductsByUserId({
      ...params,
      userId,
    });

    const productsWithFavorites: ProductWithFavorites[] = products.map((product: ProductWithFavoritesRelation) => ({
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: true,
    }));

    return {
      list: productsWithFavorites,
      totalCount,
    };
  }
}

