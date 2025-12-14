import { assert } from 'superstruct'
import { CreateArticle, PatchArticle } from '../struct.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { 
  createArticleService,
  updateArticleService,
  deleteArticleService, 
  getArticleDetailService,
  getArticleListService
} from '../services/articleService.js'



// 로그인 한 유저만 article 등록
// 1. POST /articles
export const postArticle = asyncHandler(async(req, res) => {
  assert(req.body, CreateArticle)

  const article = await createArticleService({
    user: req.user,
    articleData: req.body,
    imageFile: req.file
  })

  res.status(201).json(article);
})


// 로그인 한 유저만 article 수정 
// 2. PATCH /articles/:articleId
export const patchArticle = asyncHandler(async(req, res) => {
  assert(req.body, PatchArticle);

  const updated = await updateArticleService({
    articleId: req.params.articleId,
    user: req.user,
    articleData: req.body,
  })
// {
//   articleId: '3',
//   user: { id: 1, email: 'qkrrjstns23@gmail.com', ... },
//   articleData: { title: '...', content: '...' }
// }  

  res.status(200).json(updated)
})


// 로그인 한 유저만 article 삭제 DELETE (/:id)
// 3. DELETE /articles/:articleId
export const deleteArticle = asyncHandler(async(req, res) => {
  await deleteArticleService({
    articleId: req.params.articleId,
    user: req.user,
  });

  // 204는 보통 body 안보냄
  res.status(204).send();
})


// 로그인 한 유저가 특정 article 상세 조회
// 4. GET /articles/:articleId
export const getArticle = asyncHandler(async(req, res) => {
  // req.params는 url경로에 들어있는 값들./articles/3
  // req.query는 url경로 뒤에 오는 조건/옵션 / ?offset=0&limit=10
  const article = await getArticleDetailService(req.params.articleId) 
  // router에서 :/articleId라고 해서 articleId로 받을 수 있는것이다.

  res.status(200).json(article)
})


// 로그인 안 한 유저의 article 목록 조회 (좋아요 개수는 못 봄)
// 5. GET  http://localhost:3000/articles?keyword=""&offset=""&limit=""&order=""
export const getListArticles = asyncHandler(async(req, res) => {
  const { offset, limit, order, keyword } = req.query;

  const articles = await getArticleListService({
    offset,
    limit,
    order,
    keyword
  });

  res.status(200).json(articles)
})