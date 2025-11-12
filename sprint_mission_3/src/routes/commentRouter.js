import express from 'express'
import { patchComment_Product, deleteComment_Product, patchComment_Article, deleteComment_Article} from '../controllers/commentController.js'

const commentRouter = express.Router()

commentRouter.patch('/products/:commentId', patchComment_Product)
commentRouter.delete('/products/:commentId', deleteComment_Product)

commentRouter.patch('/articles/:commentId', patchComment_Article)
commentRouter.delete('/articles/:commentId', deleteComment_Article)

export default commentRouter