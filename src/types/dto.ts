import { User, Product, Article, Comment } from '@prisma/client';

// User DTOs
export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface RegisterDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateMeDTO {
  email?: string;
  nickname?: string;
  image?: string | null;
}

export interface UpdatePasswordDTO {
  password: string;
  newPassword: string;
}

// Product DTOs
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}

export interface ProductWithFavorites extends Omit<Product, 'favorites'> {
  favoriteCount: number;
  isFavorited?: boolean;
}

export interface ProductListResponse {
  list: ProductWithFavorites[];
  totalCount: number;
}

// Article DTOs
export interface CreateArticleDTO {
  title: string;
  content: string;
  image?: string | null;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  image?: string | null;
}

export interface ArticleWithLikes extends Omit<Article, 'likes'> {
  likeCount: number;
  isLiked?: boolean;
}

export interface ArticleListResponse {
  list: ArticleWithLikes[];
  totalCount: number;
}

// Comment DTOs
export interface CreateCommentDTO {
  content: string;
}

export interface UpdateCommentDTO {
  content?: string;
}

export interface CommentListResponse {
  list: Comment[];
  nextCursor: number | null;
}

// Pagination DTOs
export interface PageParams {
  page: number;
  pageSize: number;
  orderBy?: 'recent';
  keyword?: string;
}

export interface CursorParams {
  cursor: number;
  limit: number;
  orderBy?: 'recent';
  keyword?: string;
}

// Token DTOs
export interface TokenPayload {
  userId: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

