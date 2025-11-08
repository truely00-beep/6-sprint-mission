import prisma from '../prisma-client.js';
import ApiError from '../utils/apiError.js';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGE, DEFAULT_LIMIT, SORT_RECENT, SORT_DESC } from '../constants/index.js'; // 상수 임포트

/**
 * [GET /api/articles]
 * 게시글 목록 조회 (페이지네이션, 검색, 정렬)
 */
export const getAllArticles = async (req, res) => {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, sort, search } = req.query; // 상수 사용

  const skip = (page - 1) * limit;
  const take = limit;

  // 정렬 조건
  const orderBy =
    sort === SORT_RECENT
      ? { createdAt: SORT_DESC }
      : { createdAt: SORT_DESC }; // 기본값 최신순

  // 검색 조건
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  // 데이터 조회
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      // 목록에서는 content 일부만 보여주거나 제외할 수 있음 (요청사항은 content 포함)
      content: true,
      createdAt: true,
    },
    where,
    skip,
    take,
    orderBy,
  });

  // 전체 카운트 조회
  const totalCount = await prisma.article.count({ where });
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    data: articles,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      limit,
    },
  });
};

/**
 * [POST /api/articles]
 * 새 게시글 등록
 */
export const createArticle = async (req, res) => {
  const { title, content } = req.body;

  const newArticle = await prisma.article.create({
    data: {
      title,
      content,
    },
  });

  res.status(201).json(newArticle);
};

/**
 * [GET /api/articles/:id]
 * 게시글 상세 조회
 */
export const getArticleById = async (req, res) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: { id: id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!article) {
    throw ApiError.notFound('게시글을 찾을 수 없습니다.');
  }

  res.status(200).json(article);
};

/**
 * [PATCH /api/articles/:id]
 * 게시글 수정
 */
export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const dataToUpdate = {};
  if (title) dataToUpdate.title = title;
  if (content) dataToUpdate.content = content;

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: id },
      data: dataToUpdate,
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    throw error;
  }
};

/**
 * [DELETE /api/articles/:id]
 * 게시글 삭제
 */
export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.article.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    throw error;
  }
};
