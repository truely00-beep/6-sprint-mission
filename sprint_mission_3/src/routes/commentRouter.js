import express from 'express'
import { deleteComment_Product, patchComment_Article, patchComment_Product, deleteComment_Article } from '../controllers/commentController.js'
import { authenticate } from '../middlewares/authenticate.js'

const commentRouter = express.Router()

// 로그인 한 유저의 Product_댓글 수정
commentRouter.patch('/products/:commentId', authenticate, patchComment_Product)

// 로그인 한 유저의 Product_댓글 삭제
commentRouter.delete('/products/:commentId', authenticate, deleteComment_Product)



// 로그인 한 유저의 article_댓글 수정
commentRouter.patch('/articles/:commentId', authenticate, patchComment_Article)

// 로그인 한 유저의 article_댓글 수정
commentRouter.delete('/articles/:commentId', authenticate, deleteComment_Article)



// //상품 댓글 수정, 삭제
// commentRouter.route('/products/:commentId')
//       .patch(patchComment_Product)
//       .delete(deleteComment_Product)


// //기사 댓글 수정, 삭제
// commentRouter.route('/articles/:commentId')
//       .patch(patchComment_Article)
//       .delete(deleteComment_Article)


export default commentRouter