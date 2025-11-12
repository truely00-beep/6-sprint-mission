import express from 'express'

import { postProduct, getDetailProduct, patchProduct, deleteProduct, getListProduct } from '../controllers/productController.js'
import { createProductComment, getProductComment } from '../controllers/commentController.js'

const productRouter = express.Router()

// 상품 등록 
productRouter.post('/', postProduct)
productRouter.get('/:id', getDetailProduct)
productRouter.patch('/:id', patchProduct)
productRouter.delete('/:id', deleteProduct)
productRouter.get('/', getListProduct)


// 상품에 대한 댓글
productRouter.post('/:productId/comments', createProductComment)
productRouter.get('/:productId/comments', getProductComment)

export default productRouter