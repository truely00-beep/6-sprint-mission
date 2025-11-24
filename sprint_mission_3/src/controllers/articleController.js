import { prisma } from '../lib/prismaClient.js'
import { assert } from 'superstruct'
import { CreateArticle, PatchArticle } from '../struct.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

// 게시글 등록
export const postArticle = asyncHandler(async(req, res) => {
  assert(req.body, CreateArticle)
  const data = req.body;
  const article = await prisma.article.create({
    data
  })
  res.status(201).send(article)
})

// 게시글 상세 조회 GET (/:id)
export const getDetailArticle = asyncHandler(async(req, res) => {
  const { id } = req.params
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true
    } 
  })
   res.status(200).send(article)
})

// 상품 수정 PATCH (/:id)
export const patchArticle = asyncHandler(async(req, res) => {
  assert(req.body, PatchArticle)
  const { id } = req.params
  const data = req.body;

  const updated_article = await prisma.article.update({
    where:{ id },
    data
  })
  res.status(200).send(updated_article)
})

// 상품 삭제 DELETE (/:id)
export const deleteArticle = asyncHandler(async(req, res) => {
  const { id } = req.params
  const deleted_data = await prisma.article.delete({
    where: { id }
  })
  res.status(204).send(deleted_data)
})

// 상품 목록 조회 
export const getListArticle = asyncHandler(async(req, res) => {
  const { offset=0, limit=10, order='newest', keyword } = req.query;
  let orderBy;
  switch(order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break;
    case 'newest':
      orderBy = { createdAt: 'desc'}
      break;
    default:
      orderBy = { createdAt: 'desc' }
  }   

  const where = keyword
    ? {
      OR: [
        { title: { contains: keyword, mode: "insensitive" }},
        { content: { contains: keyword, mode: "insensitive"}}
      ]
    }
    : undefined

  const get_List_data = await prisma.article.findMany({
    where,
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true
    }
  })
  res.status(200).send(get_List_data) 
})

