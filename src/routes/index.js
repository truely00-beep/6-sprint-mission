/**
 * src/routes/index.js
 * 모든 라우트 모듈을 통합하고 마운트하는 메인 라우터 파일
 */
import { Router } from 'express';
import productRoutes from './product.routes.js';
import articleRoutes from './article.routes.js';
import commentRoutes from './comment.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

// 중고마켓 관련 라우트 마운트
// 기본 경로: /api/products
router.use('/products', productRoutes);

// 자유게시판 관련 라우트 마운트
// 기본 경로: /api/articles
router.use('/articles', articleRoutes);

// 댓글 수정/삭제 관련 라우트 마운트 (등록은 articleRoutes/productRoutes에서 처리)
// 기본 경로: /api/comments
router.use('/comments', commentRoutes);

// 이미지 업로드 라우트 마운트
// 기본 경로: /api/upload
router.use('/upload', uploadRoutes);

export default router;

