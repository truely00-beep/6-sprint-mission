import { assert } from "superstruct";
import { CreateComment, PatchComment } from "../struct.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  createProductCommentService,
  updateProductCommentService,
  deleteProductCommentService,
  getProductCommentsService,
  createArticleCommentService,
  updateArticleCommentService,
  deleteArticleCommentService,
  getArticleCommentsService
} from '../services/commentService.js'
import { createComment } from "../repositories/commentRepository.js";


// =========================
// 상품(Product) 댓글
// =========================

// 로그인 한 유저가 상품_댓글 생성
// http://localhost:3000/products/:productId/comments
export const createProductComment = asyncHandler(async (req, res) => {
  assert(req.body, CreateComment);

  const comment = await createProductCommentService({
    productId: req.params.productId,
    user: req.user,
    content: req.body.content
  })

  res.status(201).json(comment)
})



// 로그인 한 유저가 등록한 상품_Comment 수정
// http://localhost:3000/comments/products/:commentId
export const patchCommentProduct = asyncHandler(async (req, res) => {
  assert(req.body, PatchComment)

  const updated = await updateProductCommentService({
    commentId: req.params.commentId,
    user: req.user,
    content: req.body.content
  })

  res.status(200).json(updated)
})


// 로그인 한 유저가 등록한 상품_Comment 삭제
// http://localhost:3000/comments/products/:commentId
export const deleteCommentProduct = asyncHandler(async(req, res) => {
  await deleteProductCommentService({
    commentId: req.params.commentId,
    user: req.user
  })
  res.status(204).send();
})


// http://localhost:3000/products/:productId/comments?offset=""&limit=""&order=""
//// 로그인 안해도 특정 상품(productId)에 대한 댓글 조회 가능 
export const getProductComment = asyncHandler(async(req, res) => {
  const { offset=0, limit=10, order='newest' } = req.query;

  const comments = await getProductCommentsService({
    productId: req.params.productId,
    offset,
    limit,
    order
  })

  res.status(200).json(comments)
})



// 추가로 구현 해보고 싶은것 : 댓글을 검색해서 product 각각 article 찾기 



// =========================
// 기사(Article) 댓글
// =========================

// 기사(article) 댓글 생성 
// http://localhost:3000/articles/:articleId/comments
export const createArticleComment = asyncHandler(async(req, res) => {
  assert(req.body, CreateComment);

  const comment = await createArticleCommentService({
    articleId: req.params.articleId,
    user: req.user,
    content: req.body.content
  })

  res.status(201).json(comment)
})


// 기사(article) 댓글 수정 
// http://localhost:3000/comments/articles/:commentId
export const patchCommentArticle = asyncHandler(async(req, res) => {
  assert(req.body, PatchComment);

  const updated = await updateArticleCommentService({
    commentId: req.params.commentId,
    user: req.user,
    content: req.body.content
    // data: req.body로 나왔는데 이거 무시하고 위에 처럼 작성함
  })

  res.status(200).json(updated)
})


//// 로그인 한 유저가 등록한 articleComment 삭제
//http://localhost:3000/comments/articles/:commentId
export const deleteComment_Article = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;

  // commentId의 해당하는 comment가 존재하는지 확인
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // comment를 등록한 user가 로그인 한 user인지 확인
  if (comment.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.comment.delete({
    where: { id: Number(commentId) },
  });
  res.status(204).send();
});


// 로그인 한 유저가 등록한 aritlce_Comment 삭제
// http://localhost:3000/comments/articles/:commentId
export const deleteCommentArticle = asyncHandler(async(req, res) => {
  await deleteArticleCommentService({
    commentId: req.params.commentId,
    user: req.user
  })

  res.status(204).send()
})


//// 로그인 안해도 특정 article(articleId)에 대한 댓글 조회 가능 
// http://localhost:3000/articles/:articleId/comments?offset=""&limit=""&order=""
export const getArticleComment = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'newest' } = req.query;

  const comments = await getArticleCommentsService({
    articleId: req.params.articleId,
    offset,
    limit,
    order
  })

  res.status(200).json(comments)
})