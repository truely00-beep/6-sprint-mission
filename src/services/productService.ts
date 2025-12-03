import { ProductRepository } from '../repositories/productRepository.js';
import { CommentRepository } from '../repositories/commentRepository.js';
import { FavoriteRepository } from '../repositories/favoriteRepository.js';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductWithFavorites,
  ProductListResponse,
  PageParams,
  CreateCommentDTO,
  CommentListResponse,
  CursorParams,
} from '../types/dto.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export class ProductService {
  private productRepository: ProductRepository;
  private commentRepository: CommentRepository;
  private favoriteRepository: FavoriteRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.commentRepository = new CommentRepository();
    this.favoriteRepository = new FavoriteRepository();
  }

  async createProduct(userId: number, data: CreateProductDTO) {
    return this.productRepository.create({ ...data, userId });
  }

  async getProduct(id: number, userId?: number): Promise<ProductWithFavorites> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('product', id);
    }

    const { favorites, ...productWithoutFavorites } = product;
    return {
      ...productWithoutFavorites,
      favoriteCount: favorites.length,
      isFavorited: userId ? favorites.some((favorite) => favorite.userId === userId) : undefined,
    };
  }

  async updateProduct(id: number, userId: number, data: UpdateProductDTO) {
    const existingProduct = await this.productRepository.findByIdWithoutRelations(id);
    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the product');
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const existingProduct = await this.productRepository.findByIdWithoutRelations(id);
    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the product');
    }

    await this.productRepository.delete(id);
  }

  async getProductList(params: PageParams, userId?: number): Promise<ProductListResponse> {
    const { products, totalCount } = await this.productRepository.findMany(params);

    const productsWithFavorites: ProductWithFavorites[] = products.map((product) => ({
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: userId ? product.favorites.some((favorite) => favorite.userId === userId) : undefined,
    }));

    return {
      list: productsWithFavorites,
      totalCount,
    };
  }

  async createComment(productId: number, userId: number, data: CreateCommentDTO) {
    const existingProduct = await this.productRepository.findByIdWithoutRelations(productId);
    if (!existingProduct) {
      throw new NotFoundError('product', productId);
    }

    return this.commentRepository.create({
      productId,
      content: data.content,
      userId,
    });
  }

  async getCommentList(productId: number, params: CursorParams): Promise<CommentListResponse> {
    const existingProduct = await this.productRepository.findByIdWithoutRelations(productId);
    if (!existingProduct) {
      throw new NotFoundError('product', productId);
    }

    const commentsWithCursor = await this.commentRepository.findManyByProductId({
      ...params,
      productId,
    });
    const comments = commentsWithCursor.slice(0, params.limit);
    const cursorComment = commentsWithCursor[comments.length];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return {
      list: comments,
      nextCursor,
    };
  }

  async createFavorite(productId: number, userId: number): Promise<void> {
    const existingProduct = await this.productRepository.findByIdWithoutRelations(productId);
    if (!existingProduct) {
      throw new NotFoundError('product', productId);
    }

    const existingFavorite = await this.favoriteRepository.findFirst(productId, userId);
    if (existingFavorite) {
      throw new BadRequestError('Already favorited');
    }

    await this.favoriteRepository.create(productId, userId);
  }

  async deleteFavorite(productId: number, userId: number): Promise<void> {
    const existingFavorite = await this.favoriteRepository.findFirst(productId, userId);
    if (!existingFavorite) {
      throw new BadRequestError('Not favorited');
    }

    await this.favoriteRepository.delete(existingFavorite.id);
  }
}

