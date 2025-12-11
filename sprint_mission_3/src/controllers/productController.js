import { prisma } from '../lib/prismaClient.js';
import { assert } from 'superstruct'
import { CreateProduct, PatchProduct } from '../struct.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

//1. 상품 수정, 삭제 할때는 입력한 id가 테이블에 존재하는지 확인
//2. 테이블의 userId가 로그인한 유저의 id와 일치하는지 확인(로그인 한 유저인지 확인)

// 상품 등록 POST (로그인 한 유저만 상품 등록)
export const postProduct = asyncHandler(async(req, res) => {
  assert(req.body, CreateProduct)
  const product_data = req.body;
  const user = req.user; // user = 로그인 한 유저의 데이터  
  const product = await prisma.product.create({
    data: {
      ...product_data,
      user : {
        connect : { id: user.id}
      }
    }
  })
  res.status(201).send(product)
})

// req.user한번 검사해야한다.(로그인 한 유저가 이 상품의 user인지 확인 필요)
// 상품 조회 GET (로그인 한 유저의 상품 보기)
export const getProduct = asyncHandler(async(req, res) => {
  const { productId } = req.params
  const products = await prisma.product.findMany({
    where: { id: Number(productId)},
    select: {
      id: true,
      name: true,
      description: true,
      tags: true,
      likes: {
        select: {
          userId: true
        }
      },
      comments : {
          select : {
            id: true,
            userId: true,
            content: true,
          }
        }
      }
    })
  res.status(200).send(products)
})

// 상품 수정 PATCH (/:id) (로그인 한 유저만 상품 수정)
export const patchProduct = asyncHandler(async(req, res) => {
  assert(req.body, PatchProduct)
  const { productId } = req.params
  // console.log(productId)
  const data = req.body
  const user = req.user;

  // 상품 테이블에 존재하는지 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) }
  })

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  // 상품 테이블의 userId와 로그인 한 유저의 id가 맞는지 확인
  if (product.userId !== user.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const updated_product = await prisma.product.update({
    where: { id: Number(productId) },
    data : {
      ...data,
      user: {
        connect: { id: user.id }
      }
    }
  })
  res.status(200).send(updated_product)
})


// 상품 삭제 DELETE (/:id) 로그인 한 유저만 상품 삭제 
export const deleteProduct = asyncHandler(async(req, res) => {
  const { productId } = req.params
  const user = req.user;

  // 1차로 지우려는 postId가 테이블에 있는지 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) }
  })

  if (!product) {
    return res.status(404).json({ message: 'Product not found'})
  }

  // 2차로 product.userId가 인증받은 user의 id와 같은지 확인
  // 즉 로그인 한 유저가 지우는건지 확인
  if (product.userId !== user.id) {
    return res.status(403).json({ message: 'Forbidden'})
  }

  // 두가지 다 통과되었으면 이때 삭제
  const deleted_product = await prisma.product.delete({
    where: { id: Number(productId) } //autoincrement로 받아서
  })
  res.status(204).send(deleted_product)
})


// // 상품 상세 조회 GET (/:id)
// export const getDetailProduct = asyncHandler(async(req, res) => {
//   const { id } = req.params
//   const product = await prisma.product.findUniqueOrThrow({
//     where: { id},
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       price: true,
//       tags: true,
//       createdAt: true,
//     }
//   })
//   res.status(200).send(product)
// })


// // 상품 목록 조회 GET  http://localhost:3000/products?keyword=""&offset=""&limit=""&order=""
// export const getListProduct = asyncHandler(async(req, res) => {
//   const { offset=0, limit=10, order="newest", keyword } = req.query;
//   let orderBy;
//   switch (order) {
//     case "oldest":
//       orderBy = { createdAt: "asc" }
//       break;
//     case "newest":
//       orderBy = { createdAt: "desc" }
//     default:
//       orderBy = { createdAt: "desc" }
//   }
//   const where = keyword
//     ? {
//       OR:[
//         { name: { contains: keyword, mode: "insensitive" }},
//         { description: { contains: keyword, mode: "insensitive"}}
//       ]
//     }
//     : undefined
  
//   const getList = await prisma.product.findMany({
//     where,
//     orderBy,
//     skip: parseInt(offset),
//     take: parseInt(limit)
//   })
//   res.status(200).send(getList)
// })