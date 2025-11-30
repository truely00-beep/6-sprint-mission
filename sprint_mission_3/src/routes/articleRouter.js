import express from 'express'

import { postArticle, getDetailArticle, patchArticle, deleteArticle, getListArticle } from '../controllers/articleController.js'
import { createArticleComment, getArticleComment } from '../controllers/commentController.js'
const articleRouter = express.Router()

// 기사 등록 
articleRouter.route('/')
    .post(postArticle)
    .get(getListArticle)

articleRouter.route('/:id')
    .get(getDetailArticle)
    .delete(deleteArticle)
    .patch(patchArticle)


// 기사 댓글 생성 & 조회
articleRouter.route('/:articleId/comments')
    .post(createArticleComment)
    .get(getArticleComment)

    
export default articleRouter