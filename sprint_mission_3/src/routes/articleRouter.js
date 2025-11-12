import express from 'express'

import { postArticle, getDetailArticle, patchArticle, deleteArticle, getListArticle } from '../controllers/articleController.js'
import { createArticleComment, getArticleComment } from '../controllers/commentController.js'
const articleRouter = express.Router()

// 기사 등록 
articleRouter.post('/', postArticle)
articleRouter.get('/:id', getDetailArticle)
articleRouter.patch('/:id', patchArticle)
articleRouter.delete('/:id', deleteArticle)
articleRouter.get('/', getListArticle)

// 기사 댓글 생성 & 조회
articleRouter.post('/:articleId/comments', createArticleComment)
articleRouter.get('/:articleId/comments', getArticleComment)

export default articleRouter