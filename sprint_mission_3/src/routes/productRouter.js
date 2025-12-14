import express from 'express'
// import { getDetailProduct } from '../controllers/productController.js'
import { postProduct, patchProduct, deleteProduct, getProduct, getListProducts } from '../controllers/productController.js'
import { createProductComment, getProductComment } from '../controllers/commentController.js'
import { authenticate } from '../middlewares/authenticate.js'
import { createProductLike, deleteProductLike } from '../controllers/likeController.js'
import { upload } from '../middlewares/upload.js'

const productRouter = express.Router()

// 로그인한 유저가 Product 등록
// multipart/form-data에서 파일 파싱 + 저장, req.file 세팅
productRouter.post('/', authenticate, upload.single('image'), postProduct)


// 로그인 한 유저가 특정 상품 상세 조회
productRouter.get('/:productId', authenticate, getProduct)

// 로그인 한 유저가 Product 수정
productRouter.patch('/:productId', authenticate, patchProduct)

// 로그인 한 유저가 Product 삭제
productRouter.delete('/:productId', authenticate, deleteProduct)

// 로그인 한 유저가 상품에 '좋아요' 클릭
productRouter.post('/:productId/like', authenticate, createProductLike)

// 로그인 한 유저가 상품에 '좋아요 취소' 클릭
productRouter.delete('/:productId/like', authenticate, deleteProductLike)

// 로그인 안 한 유저가 상품 목록 조회(좋아요 개수는 못봄)
productRouter.get('/', getListProducts)


//***** 댓글 Comment *****//
// 로그인 한 유저가 Product_댓글 등록
productRouter.post('/:productId/comments', authenticate, createProductComment)

// 로그인 안 한 유저가 특정 상품 댓글 조회
productRouter.get('/:productId/comments', getProductComment)


// productRouter.route('/:id')
//     .get(getDetailProduct)

export default productRouter