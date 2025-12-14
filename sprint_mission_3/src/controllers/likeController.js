import { asyncHandler } from '../middlewares/asyncHandler.js'
import {
  createProductLikeService,
  deleteProductLikeService,
  createArticleLikeService,
  deleteArticleLikeService
} from '../services/likeService.js'

/////// product ///////
/**
 * 로그인 한 유저가 Product '좋아요' 클릭
 */
export const createProductLike = asyncHandler(async(req, res) => {
  await createProductLikeService({
    userId: req.user.id,
    productId: req.params.productId
  });

  return res.status(201).json({ message: '"좋아요"를 눌렀습니다.'})
})


/**
 * 로그인 한 유저가 product에 한 '좋아요 취소'
 */
export const deleteProductLike = asyncHandler(async(req, res) => {
  await deleteProductLikeService({
    userId: req.user.id,
    productId: req.params.productId
  })

  return res.status(200).json({ message: '"좋아요 취소" 하였습니다.'})
})




/////// article ///////

/**
 * 로그인 한 유저가 article '좋아요' 클릭
 */
export const createArticleLike = asyncHandler(async(req,res) => {
  await createArticleLikeService({
    userId: req.user.id,
    articleId: req.params.articleId
  });

  return res.status(201).json({ message: '"좋아요"를 눌렀습니다.'})
})


/**
 * 로그인 한 유저가 article '좋아요 취소'
 */
export const deleteArticleLike = asyncHandler(async (req, res) => {
  await deleteArticleLikeService({
    userId: req.user.id,
    articleId: req.params.articleId
  })

  return res.status(200).json({ message: '"좋아요 취소" 하였습니다.'})
})