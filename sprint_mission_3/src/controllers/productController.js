import { prisma } from '../lib/prismaClient.js';
import { assert } from 'superstruct'
import { CreateProduct, PatchProduct } from '../structs.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

// 상품 등록 POST
export const postProduct = asyncHandler(async(req, res) => {
  assert(req.body, CreateProduct)
  const data = req.body;
  const product = await prisma.product.create({
    data
  })
  res.status(201).send(product)
})

// 상품 상세 조회 GET (/:id)
export const getDetailProduct = asyncHandler(async(req, res) => {
  const { id } = req.params
  const product = await prisma.product.findUniqueOrThrow({
    where: { id},
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    }
  })
  res.status(200).send(product)
})

// 상품 수정 PATCH (/:id)
export const patchProduct = asyncHandler(async(req, res) => {
  assert(req.body, PatchProduct)
  const { id } = req.params
  const data = req.body

  const updated_product = await prisma.product.update({
    where: { id },
    data
  })
  res.status(200).send(updated_product)
})

// 상품 삭제 DELETE (/:id)
export const deleteProduct = asyncHandler(async(req, res) => {
  const { id } = req.params
  const deleted_product = await prisma.product.delete({
    where: { id }
  })
  res.status(204).send(deleted_product)
})

// 상품 목록 조회 GET 
export const getListProduct = asyncHandler(async (req, res) => {
  const { offset=0, limit=10, order='newest'} = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc'}
      break;
    case 'newest':
      orderBy = { createdAt: 'desc'}
      break;
    default:
      orderBy = { createdAt: 'desc'}
  }
  const get_List_product = await prisma.product.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true
    }
  }) 
  res.status(200).send(get_List_product)
})