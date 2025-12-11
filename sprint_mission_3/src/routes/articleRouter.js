import express from 'express'
import { authenticate } from '../middlewares/authenticate.js'
// import { postArticle, getDetailArticle, patchArticle, deleteArticle, getListArticle } from '../controllers/articleController.js'
import { postArticle, patchArticle, deleteArticle, getArticle } from '../controllers/articleController.js'
// import { createArticleComment, getArticleComment } from '../controllers/commentController.js'
import { createArticleComment } from '../controllers/commentController.js'
import { createArticleLike, deleteArticleLike } from '../controllers/likeController.js'

const articleRouter = express.Router()


// 로그인 한 유저 article 등록
articleRouter.post('/', authenticate, postArticle)

// 로그인 한 유저가 article 조회
articleRouter.get('/:articleId', authenticate, getArticle)

// 로그인 한 유저 article 수정
articleRouter.patch('/:articleId', authenticate, patchArticle)

// 로그인 한 유저 article 삭제
articleRouter.delete('/:articleId', authenticate, deleteArticle)

// 로그인 한 유저가 등록된 article_댓글 생성
articleRouter.post('/:articleId/comments', authenticate, createArticleComment)

// 로그인 한 유저가 article에 '좋아요' 클릭
articleRouter.post('/:articleId/like', authenticate, createArticleLike)

// 로그인 한 유저가 article에 '좋아요 취소' 클릭
articleRouter.delete('/:articleId/like', authenticate, deleteArticleLike)





// 기사 등록 
// articleRouter.route('/')
//     .post(postArticle)
//     .get(getListArticle)

// articleRouter.route('/:id')
//     .get(getDetailArticle)
//     .delete(deleteArticle)
//     .patch(patchArticle)


// 기사 댓글 생성 & 조회
// articleRouter.route('/:articleId/comments')
//     .post(createArticleComment)
//     .get(getArticleComment)

    
export default articleRouter