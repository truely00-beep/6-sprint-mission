import express from 'express'

import { postProduct, getDetailProduct, patchProduct, deleteProduct, getListProduct } from '../controllers/productController.js'
import { createProductComment, getProductComment } from '../controllers/commentController.js'

const productRouter = express.Router()

// 상품
productRouter.route('/')
    .post(postProduct)
    .get(getListProduct)


productRouter.route('/:id')
    .get(getDetailProduct)
    .patch(patchProduct)
    .delete(deleteProduct)



// 상품에 대한 댓글
productRouter.route('/:productId/comments')
    .post(createProductComment)
    .get(getProductComment)


export default productRouter