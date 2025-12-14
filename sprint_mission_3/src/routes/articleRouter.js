import express from 'express'
import { authenticate } from '../middlewares/authenticate.js'
// import { getDetailArticle } from '../controllers/articleController.js'
import { postArticle, patchArticle, deleteArticle, getArticle, getListArticles } from '../controllers/articleController.js'
import { createArticleComment, getArticleComment } from '../controllers/commentController.js'
import { createArticleLike, deleteArticleLike } from '../controllers/likeController.js'
import { upload } from '../middlewares/upload.js'

const articleRouter = express.Router()


// 로그인 한 유저 article 등록 (postman에서 속성을 image로 해야 multer가 받는다, 이걸로 multer가 파일을 찾고 저장하는 거니까.)
// upload.single('image')가 실행되면서 req 객체에 file 프로퍼티를 추가해 준다”
articleRouter.post('/', authenticate, upload.single('image'), postArticle)

// 로그인 한 유저가 특정 article 조회
articleRouter.get('/:articleId', authenticate, getArticle)

// 로그인 한 유저가 article 수정
articleRouter.patch('/:articleId', authenticate, patchArticle)

// 로그인 한 유저 article 삭제
articleRouter.delete('/:articleId', authenticate, deleteArticle)

// 로그인 한 유저가 article에 '좋아요' 클릭
articleRouter.post('/:articleId/like', authenticate, createArticleLike)

// 로그인 한 유저가 article에 '좋아요 취소' 클릭
articleRouter.delete('/:articleId/like', authenticate, deleteArticleLike)

// 로그인 안 한 유저가 article 목록 조회(좋아요 개수는 못 봄)
articleRouter.get('/', getListArticles)


//***** 댓글 Comment *****//
// 로그인 한 유저가 등록된 article_댓글 생성
articleRouter.post('/:articleId/comments', authenticate, createArticleComment)

// 로그인 안 한 유저가 특정 article 댓글 조회
articleRouter.get('/:articleId/comments', getArticleComment)


// articleRouter.route('/:id')
//     .get(getDetailArticle)

    
export default articleRouter