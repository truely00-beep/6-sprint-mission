// Express 라우터를 가져옵니다
import express from 'express';
// 상품 컨트롤러를 가져옵니다
import ProductController from '../controllers/ProductController.js';
// 유효성 검증 미들웨어를 가져옵니다
import { validateProductCreate, validateProductUpdate } from '../errors/validation.js';
// 에러 핸들러를 가져옵니다
import { asyncHandler } from '../errors/errorHandler.js';

// Express 라우터를 생성합니다
const router = express.Router();

// 상품 등록 API (POST /api/products)
// 새로운 상품을 등록할 때 사용합니다
router.post('/', validateProductCreate, asyncHandler(ProductController.createProduct));

// 상품 상세 조회 API (GET /api/products/:id)
// 특정 상품의 상세 정보를 조회할 때 사용합니다
router.get('/:id', asyncHandler(ProductController.getProductById));

// 상품 수정 API (PATCH /api/products/:id)
// 기존 상품의 정보를 수정할 때 사용합니다
router.patch('/:id', validateProductUpdate, asyncHandler(ProductController.updateProduct));

// 상품 삭제 API (DELETE /api/products/:id)
// 상품을 삭제할 때 사용합니다
router.delete('/:id', asyncHandler(ProductController.deleteProduct));

// 상품 목록 조회 API (GET /api/products)
// 상품 목록을 조회할 때 사용합니다 (페이지네이션, 정렬, 검색 기능 포함)
router.get('/', asyncHandler(ProductController.getProducts));

// 라우터를 내보냅니다
export default router;
