import { prisma } from '../lib/prismaClient.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

// 로그인 한 유저가 Product '좋아요' 클릭
export const createProductLike = asyncHandler(async(req, res) => {
  const userId = req.user.id
  const productId = Number(req.params.productId)
  // console.log(userId)
  // console.log(productId)
  // 이미 좋아요 눌렀는지 확인
  const existingLike = await prisma.productLike.findUnique({
    where: { 
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existingLike) {
    return res.status(400).json({ message: 'Already liked' })
  }

  // 좋아요 생성
  await prisma.productLike.create({
    data: {
      user: {
        connect: { id: userId}
      },
      product: {
        connect: { id: productId}
      } 
    }
  })
  res.status(201).json({ message: '"좋아요"를 눌렀습니다.' })
})


// 로그인 한 유저가 '좋아요 취소'
export const deleteProductLike = asyncHandler(async(req, res) => {
  const userId = req.user.id
  const productId = Number(req.params.productId)
  // console.log(userId)
  // console.log(productId)

  // 이미 좋아요 눌렀는지 확인
  const existingLike = await prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (!existingLike) {
    return res.status(400).json({ message: '이미 좋아요 취소 상태입니다.' })
  }

  // 좋아요 취소
  await prisma.productLike.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  })
  res.status(200).json({ message: '"좋아요 취소" 하였습니다.'})
})


// 로그인 한 유저가 article '좋아요' 클릭
export const createArticleLike = asyncHandler(async(req, res) => {
  const userId = req.user.id
  const articleId = Number(req.params.articleId)

  const existingLike = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId
      }
    }
  })

  if (existingLike) {
    return res.status(400).json({ message: 'Already liked'})
  }

  // 좋아요 생성
  await prisma.articleLike.create({
    data: {
      user: {
        connect : { id: userId }
      },
      article: {
        connect: { id: articleId}
      }
    }
  })
  res.status(201).json({ message: '"좋아요"를 눌렀습니다.'})
})


// 로그인 한 유저가 '좋아요 취소'
export const deleteArticleLike = asyncHandler(async(req, res) => {
  const userId = req.user.id
  const articleId = Number(req.params.articleId)

  // 이미 좋아요 눌렀는지 확인
  const existingLike = await prisma.articleLike.findUnique({
    where : {
      userId_articleId : {
        userId,
        articleId
      }
    }
  })

  if (!existingLike) {
    return res.stauts(400).json({ message: '이미 좋아요 취소 상태입니다.'})
  }

  // 좋아요 취소
  await prisma.articleLike.delete({
    where: {
      userId_articleId: {
        userId,
        articleId
      }
    }
  })
  res.status(200).json({ message: '"좋아요 취소" 하였습니다.'})
})

