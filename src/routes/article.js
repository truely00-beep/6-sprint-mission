/**
 * src/routes/article.routes.js
 * 자유게시판(Article) 관련 API 라우트 정의
 */
import { Router } from 'express';
import {
    createArticle,
    getArticleList,
    getArticleDetail,
    updateArticle,
    deleteArticle,
} from '../controllers/article.controller.js';
import {
    createComment,
    getCommentList,
} from '../controllers/comment.controller.js';
import { validateCreateArticle, validateUpdateArticle } from '../middlewares/validators/article.js';

const router = Router();

// =================================================================
// 1. 게시글 목록 조회 및 등록
// (POST /articles, GET /articles)
// router.route()를 사용하여 중복되는 라우트 경로(/articles) 통합
// =================================================================
router.route('/')
    /**
     * @route POST /articles
     * @desc 새로운 게시글 등록
     */
    .post(validateCreateArticle, createArticle)

    /**
     * @route GET /articles
     * @desc 게시글 목록 조회 (offset 페이지네이션, 검색, 최신순 정렬)
     */
    .get(getArticleList);

// =================================================================
// 2. 특정 게시글 상세 조회, 수정, 삭제
// (GET /articles/:id, PATCH /articles/:id, DELETE /articles/:id)
// =================================================================
router.route('/:id')
    /**
     * @route GET /articles/:id
     * @desc 특정 ID를 가진 게시글 상세 조회
     */
    .get(getArticleDetail)

    /**
     * @route PATCH /articles/:id
     * @desc 특정 ID를 가진 게시글 수정
     */
    .patch(validateUpdateArticle, updateArticle)

    /**
     * @route DELETE /articles/:id
     * @desc 특정 ID를 가진 게시글 삭제
     */
    .delete(deleteArticle);

// =================================================================
// 3. 댓글 등록 및 목록 조회
// (POST /articles/:id/comments, GET /articles/:id/comments)
// =================================================================
router.route('/:id/comments')
    /**
     * @route POST /articles/:id/comments
     * @desc 특정 게시글에 댓글 등록
     */
    .post(createComment) // Comment Controller에서 Article 댓글 등록 처리

    /**
     * @route GET /articles/:id/comments
     * @desc 특정 게시글의 댓글 목록 조회 (cursor 페이지네이션)
     */
    .get(getCommentList); // Comment Controller에서 Article 댓글 목록 조회 처리


export default router;
