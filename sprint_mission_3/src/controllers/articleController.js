import { prisma } from '../lib/prismaClient.js'
import { assert } from 'superstruct'
import { CreateArticle, PatchArticle } from '../struct.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

// 로그인 한 유저만 article 등록
export const postArticle = asyncHandler(async(req, res) => {
  assert(req.body, CreateArticle)
  const article_data = req.body;
  const user = req.user
  // console.log(user.id)
  // console.log(typeof(user.id))
  const article = await prisma.article.create({
    data: {
      ...article_data,
      user : {
        connect : { id: user.id }
      }  
    }
  })
  res.status(201).send(article)
})


// req.user=user 로 검사해야 하는가(로그인 한 유저가 이 상품의 user인지 확인 필요?)
// 로그인 한 유저와 로그인 안 한 유저 구별 필요.

// 로그인 한 유저의 article 보기
export const getArticle = asyncHandler(async(req, res) => {
  const { articleId } = req.params
  const articles = await prisma.article.findMany({
    where: { id: Number(articleId) },
    select: {
      id: true,
      title: true,
      content: true,
      likes: {
        select: {
          userId: true
        }
      },
      comments: {
        select: {
          id: true,
          userId: true,
          content: true
        }
      }
    }
  })
  res.status(200).send(articles)
})


// 로그인 한 유저만 article 수정 PATCH (/:id)
export const patchArticle = asyncHandler(async(req, res) => {
  assert(req.body, PatchArticle)
  const { articleId } = req.params
  const article_data = req.body;
  const user = req.user

  // query로 입력 받은 id의 article이 존재하는지 확인
  const article = await prisma.article.findUnique({ 
    where: { id : Number(articleId) }
  })

  if (!article) {
    return res.status(403).json({ message: 'Article not found'})
  }

  // Article 테이블의 id와 로그인 한 유저가 맞는지 확인
  if (article.userId !== user.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const updated_article = await prisma.article.update({
    where:{ id : Number(articleId) },
    data : {
      ...article_data,
      user : {
        connect : { id : user.id }
      }
    }
  })
  res.status(200).send(updated_article)
})


// 로그인 한 유저만 article 삭제 DELETE (/:id)
export const deleteArticle = asyncHandler(async(req, res) => {
  const { articleId } = req.params
  const user = req.user

  const article = await prisma.article.findUnique({
    where: { id: Number(articleId) }
  })
  
  if (!article) {
    return res.status(403).json({ message: 'Article not found'})
  }

  if (article.userId !== user.id) {
    return res.status(403).json({ message: 'Forbidden'})
  }

  const deleted_data = await prisma.article.delete({
    where: { id : Number(articleId) }
  })
  res.status(204).send(deleted_data)
})




// // 게시글 목록 조회 
// export const getListArticle = asyncHandler(async(req, res) => {
//   const { offset=0, limit=10, order='newest', keyword } = req.query;
//   let orderBy;
//   switch(order) {
//     case 'oldest':
//       orderBy = { createdAt: 'asc' }
//       break;
//     case 'newest':
//       orderBy = { createdAt: 'desc'}
//       break;
//     default:
//       orderBy = { createdAt: 'desc' }
//   }   

//   const where = keyword
//     ? {
//       OR: [
//         { title: { contains: keyword, mode: "insensitive" }},
//         { content: { contains: keyword, mode: "insensitive"}}
//       ]
//     }
//     : undefined

//   const get_List_data = await prisma.article.findMany({
//     where,
//     orderBy,
//     skip: parseInt(offset),
//     take: parseInt(limit),
//     select: {
//       id: true,
//       title: true,
//       content: true,
//       createdAt: true
//     }
//   })
//   res.status(200).send(get_List_data) 
// })

