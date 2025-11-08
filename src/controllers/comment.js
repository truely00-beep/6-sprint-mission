import prisma from '../prisma-client.js';
import ApiError from '../utils/apiError.js';
import { Prisma } from '@prisma/client';
import { DEFAULT_LIMIT } from '../constants/index.js'; // 상수 임포트

// --- 상품 댓글 (ProductComment) ---

/**
 * [POST /api/products/:id/comments]
 * 새 상품 댓글 등록
 */
export const createProductComment = async (req, res) => {
  const { id: productId } = req.params;
  const { content } = req.body;

  // 상품이 존재하는지 먼저 확인 (외래 키 제약 조건 전에 사용자 친화적인 에러 제공)
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw ApiError.notFound('댓글을 작성할 상품을 찾을 수 없습니다.');
  }

  const newComment = await prisma.productComment.create({
    data: {
      content,
      productId: productId,
    },
  });

  // 201 Created 상태 코드
  res.status(201).json(newComment);
};

/**
 * [GET /api/products/:id/comments]
 * 상품 댓글 목록 조회 (Cursor Pagination)
 */
export const getProductComments = async (req, res) => {
  const { id: productId } = req.params;
  // limit에 상수 적용
  const { cursor, limit = DEFAULT_LIMIT } = req.query;

  const take = parseInt(limit);

  // Prisma 커서 기반 페이지네이션 설정
  // 커서가 있으면 해당 커서 이후(보다 작은 ID)의 데이터를 가져옴
  const cursorOptions = cursor ? { id: cursor } : undefined;
  // skip: 1 은 커서로 사용된 항목을 제외
  const skip = cursor ? 1 : 0;

  const comments = await prisma.productComment.findMany({
    where: { productId: productId },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    take,
    skip,
    cursor: cursorOptions,
    orderBy: {
      id: Prisma.SortOrder.desc, // 커서 페이지네이션은 고유하고 순차적인 값(id)으로 정렬
    },
  });

  // 다음 커서 결정 (가져온 결과가 요청한 take 수만큼 있다면, 마지막 항목의 ID가 다음 커서가 됨)
  const nextCursor =
    comments.length === take ? comments[comments.length - 1].id : null;

  res.status(200).json({
    data: comments,
    pagination: {
      nextCursor,
      limit: take,
    },
  });
};

/**
 * [PATCH /api/comments/product/:id]
 * 상품 댓글 수정
 */
export const updateProductComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body; // 유효성 검증 미들웨어에서 content 필드 보장

  try {
    const updatedComment = await prisma.productComment.update({
      where: { id: id },
      data: { content },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    // P2025 (Not Found) 에러는 에러 핸들러에서 404로 처리됨
    throw error;
  }
};

/**
 * [DELETE /api/comments/product/:id]
 * 상품 댓글 삭제
 */
export const deleteProductComment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.productComment.delete({
      where: { id: id },
    });
    // 204 No Content 상태 코드
    res.status(204).send();
  } catch (error) {
    throw error;
  }
};

// --- 게시글 댓글 (ArticleComment) ---

/**
 * [POST /api/articles/:id/comments]
 * 새 게시글 댓글 등록
 */
export const createArticleComment = async (req, res) => {
  const { id: articleId } = req.params;
  const { content } = req.body;

  // 게시글 존재 확인
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!article) {
    throw ApiError.notFound('댓글을 작성할 게시글을 찾을 수 없습니다.');
  }

  const newComment = await prisma.articleComment.create({
    data: {
      content,
      articleId: articleId,
    },
  });

  // 201 Created 상태 코드
  res.status(201).json(newComment);
};

/**
 * [GET /api/articles/:id/comments]
 * 게시글 댓글 목록 조회 (Cursor Pagination)
 */
export const getArticleComments = async (req, res) => {
  const { id: articleId } = req.params;
  const { cursor, limit = DEFAULT_LIMIT } = req.query; // 상수 사용

  const take = parseInt(limit);
  const cursorOptions = cursor ? { id: cursor } : undefined;
  const skip = cursor ? 1 : 0;

  const comments = await prisma.articleComment.findMany({
    where: { articleId: articleId },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    take,
    skip,
    cursor: cursorOptions,
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
  });

  const nextCursor =
    comments.length === take ? comments[comments.length - 1].id : null;

  res.status(200).json({
    data: comments,
    pagination: {
      nextCursor,
      limit: take,
    },
  });
};

/**
 * [PATCH /api/comments/article/:id]
 * 게시글 댓글 수정
 */
export const updateArticleComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await prisma.articleComment.update({
      where: { id: id },
      data: { content },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    throw error;
  }
};

/**
 * [DELETE /api/comments/article/:id]
 * 게시글 댓글 삭제
 */
export const deleteArticleComment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.articleComment.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    throw error;
  }
};
