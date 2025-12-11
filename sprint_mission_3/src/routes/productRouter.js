import express from 'express'
// import { postProduct, getDetailProduct, patchProduct, deleteProduct, getListProduct } from '../controllers/productController.js'
import { postProduct, patchProduct, deleteProduct, getProduct } from '../controllers/productController.js'
// import { createProductComment, getProductComment } from '../controllers/commentController.js'
import { createProductComment } from '../controllers/commentController.js'
import { authenticate } from '../middlewares/authenticate.js'
import { createProductLike, deleteProductLike } from '../controllers/likeController.js'

const productRouter = express.Router()

// 로그인한 유저가 Product 등록
productRouter.post('/', authenticate, postProduct)

// 로그인 한 유저가 상품 조회
productRouter.get('/:productId', authenticate, getProduct)

// 로그인한 유저가 Product 수정
productRouter.patch('/:productId', authenticate, patchProduct)

// 로그인한 유저가 Product 삭제
productRouter.delete('/:productId', authenticate, deleteProduct)

// 로그인 한 유저가 Product_댓글 등록
productRouter.post('/:productId/comments', authenticate, createProductComment)

// 로그인 한 유저가 상품에 '좋아요' 클릭
productRouter.post('/:productId/like', authenticate, createProductLike)

// 로그인 한 유저가 상품에 '좋아요 취소' 클릭
productRouter.delete('/:productId/like', authenticate, deleteProductLike)



// 상품
// productRouter.route('/')
//     .post(postProduct)
//     .get(getListProduct)


// productRouter.route('/:id')
//     .get(getDetailProduct)
//     .patch(patchProduct)
//     .delete(deleteProduct)


// // 상품에 대한 댓글
// productRouter.route('/:productId/comments')
//     .post(createProductComment)
//     .get(getProductComment)


export default productRouter