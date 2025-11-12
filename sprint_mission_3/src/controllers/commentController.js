import { prisma } from '../lib/prismaClient.js'
import { assert } from 'superstruct'
import { CreateComment, PatchComment } from '../structs.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

///////////////////////////상품(Product)///////////////////////////////

// 상품(Product) 댓글 생성 
// http://localhost:3000/products/:productId/comments
export const createProductComment = asyncHandler(async(req,res) => {
  assert(req.body, CreateComment)
  const { productId } = req.params
  const { content } = req.body

  //productId에 해당하는 product 데이터 있나 확인.
  const existingProduct = await prisma.product.findUniqueOrThrow({
    where: { id: productId }
  })
  if (!existingProduct) {
    throw new Error("NotFoundError")
  }

  //productId로 FK 연결되어있는 product의 comment 생성
  const comment = await prisma.comment.create({
    data: {
      content,
      productId
    }
  })
  res.status(201).send(comment)
})


// 상품(Product) 댓글 조회
// http://localhost:3000/products/:productId/comments
export const getProductComment = asyncHandler(async(req, res) => {
  const { productId } = req.params
  const existingProduct = await prisma.product.findUniqueOrThrow({
    where: { id: productId }
  })  
  if (!existingProduct) {
    throw new Error("NotFoundError")
  }

  const comments = await prisma.comment.findMany({
    where: { productId },
    select: {
      id: true,
      content: true,
      createdAt: true
    }
  })
  res.status(200).send(comments)
})


// 상품(Product) Comment 수정
// http://localhost:3000/comments/products/:commentId
export const patchComment_Product = asyncHandler(async(req, res) => {
  assert(req.body, PatchComment)
  const { commentId } = req.params;
  const { content } = req.body;

  const updated_comment = await prisma.comment.update({
    where: {id: commentId},
    data: {content}
  })
  res.status(200).send(updated_comment)
})


// 상품(Product) Comment 삭제
// http://localhost:3000/comments/products/:commentId
export const deleteComment_Product = asyncHandler(async(req, res) => {
  const { commentId } = req.params;
  const deleted_comment = await prisma.comment.delete({
    where: { id: commentId }
  })
  res.status(204).send(deleted_comment)
})




///////////////////////////기사(Article)///////////////////////////////

// 기사(article) 댓글 생성 // http://localhost:3000/articles/:articleId/comments
export const createArticleComment = asyncHandler(async(req, res) => {
  assert(req.body, CreateComment)
  const { articleId } = req.params
  const { content } = req.body;

  // article db에 있는 id가 url로 넘어온 articleId와 같은지
  const existingArticle = await prisma.article.findUniqueOrThrow({
    where: { id: articleId }
  })
  if (!existingArticle) {
    throw new Error("NotFoundError")
  }

  // 특정 article 댓글 생성하기
  const comment = await prisma.comment.create({
    data: {
      content,
      articleId
    }
  })
  res.status(201).send(comment)
})

// 기사(article) 댓글 조회 // http://localhost:3000/articles/:articleId/comments
export const getArticleComment = asyncHandler(async(req, res) => {
  const { articleId } = req.params
  
  const existingArticle = await prisma.article.findUniqueOrThrow({
    where: { id: articleId }
  })
  if (!existingArticle) {
    throw new Error("NotFoundError")
  }

  const articles = await prisma.comment.findMany({
    where: { articleId },
    select: {
      id: true,
      content: true,
      createdAt: true
    }
  })
  res.status(200).send(articles)
})

// 기사(article) 댓글 수정 // http://localhost:3000/comments/articles/:commentId
export const patchComment_Article = asyncHandler(async(req, res) => {
  assert(req.body, PatchComment)  
  const { commentId } = req.params;
  const data = req.body;
  const updated_comment = await prisma.article.update({
    where:{ id: commentId },
    data
  })
  res.status(200).send(updated_comment)
})

// 기사(article) 댓글 삭제 // http://localhost:3000/comments/articles/:commentId
export const deleteComment_Article = asyncHandler(async(req, res) => {
  const { commentId } = req.params
  const deleted_comment = await prisma.comment.delete({
    where: { id: commentId }
  })
  res.status(204).send(deleted_comment)
})