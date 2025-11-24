import express from 'express'
import { patchComment_Product, deleteComment_Product, patchComment_Article, deleteComment_Article} from '../controllers/commentController.js'

const commentRouter = express.Router()

//상품 댓글 수정, 삭제
commentRouter.route('/products/:commentId')
      .patch(patchComment_Product)
      .delete(deleteComment_Product)


//기사 댓글 수정, 삭제
commentRouter.route('/articles/:commentId')
      .patch(patchComment_Article)
      .delete(deleteComment_Article)


export default commentRouter