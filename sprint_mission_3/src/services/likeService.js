import * as likeRepo from '../repositories/likeRepository.js'

// 상품 좋아요
export async function createProductLikeService({ userId, productId }) {
  const existing = await likeRepo.findProductLike(userId, productId);
  if (existing) {
    const err =  new Error('Already liked')
    err.status = 400;
    throw err;
  }

  await likeRepo.createProductLike(userId, productId);
  return;
}

// 상품 좋아요 취소
export async function deleteProductLikeService({ userId, productId }) {
  const existing = await likeRepo.findProductLike(userId, productId);
  if (!existing) {
    const err = new Error('이미 좋아요 취소 상태입니다.');
    err.status = 400;
    throw err;
  }

  await likeRepo.deleteProductLike(userId, productId);
  return;
}


// article 좋아요
export async function createArticleLikeService({ userId, articleId }) {
  const existing = await likeRepo.findArticleLike(userId, articleId);
  if (existing) {
    const err = new Error('Already liked')
    err.status = 400;
    throw err;
  }

  await likeRepo.createArticleLike(userId, articleId);
  return;
}

// article 좋아요 취소
export async function deleteArticleLikeService({ userId, articleId }) {
  const existing = await likeRepo.findArticleLike(userId, articleId);
  if (!existing) {
    const err = new Error('이미 좋아요 취소 상태입니다.');
    err.status = 400;
    throw err;
  }

  await likeRepo.deleteArticleLike(userId, articleId);
  return;
}