import express from 'express'
import { deleteCommentProduct, patchCommentArticle, patchCommentProduct, deleteCommentArticle } from '../controllers/commentController.js'
import { authenticate } from '../middlewares/authenticate.js'

const commentRouter = express.Router()

// 로그인 한 유저의 Product_댓글 수정
commentRouter.patch('/products/:commentId', authenticate, patchCommentProduct)

// 로그인 한 유저의 Product_댓글 삭제
commentRouter.delete('/products/:commentId', authenticate, deleteCommentProduct)

// 로그인 한 유저의 article_댓글 수정
commentRouter.patch('/articles/:commentId', authenticate, patchCommentArticle)

// 로그인 한 유저의 article_댓글 수정
commentRouter.delete('/articles/:commentId', authenticate, deleteCommentArticle)


export default commentRouter