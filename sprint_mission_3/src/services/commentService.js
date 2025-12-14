import * as commentRepo from '../repositories/commentRepository.js'
import * as productRepo from '../repositories/productRepository.js'
import * as articleRepo from '../repositories/articleRepository.js'


// =========================
// 상품(Product) 댓글
// =========================

// 1. 상품 댓글 생성
export async function createProductCommentService({ productId, user, content}) {
  // productId에 해당하는 데이터가 DB에 있는지 확인
  const product = await productRepo.findProductById(productId);
  if (!product) {
    const err = new Error('Product not found')
    err.status = 404;
    throw err;
  }

  return commentRepo.createComment({
    content,
    user: { connect: { id: user.id }},
    product: { connect: { id: Number(productId) }}
  });
}

// 2. 상품 댓글 수정 (실제로는 댓글 수정은 product/article 구분 필요 없음)
export async function updateProductCommentService({ commentId, user, content }) {
  // commentId에 해당하는 데이터가 DB에 있는지 확인
  const comment = await commentRepo.findCommentById(commentId)
  if (!comment) {
    const err = new Error('Comment not found')
    err.status = 404;
    throw err;
  }

  // 권한 확인
  if (comment.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  return commentRepo.updateComment(commentId, { content })
}


// 3. 상품 댓글 삭제
export async function deleteProductCommentService({ commentId, user}) {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) {
    const err = new Error('Comment not found')
    err.status = 404;
    throw err;
  }

  // 권한 확인
  if (comment.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  await commentRepo.deleteComment(commentId)
}


// 4. 상품 댓글 목록 조회
export async function getProductCommentsService({
  productId,
  offset = 0,
  limit = 10,
  order = 'newest'
}) {
  // 상품id에 해당하는 상품이 DB에 있나 확인
  const product = await productRepo.findProductById(productId)
  if (!product) {
    const err = new Error('Product not found')
    err.status = 404;
    throw err;
  }
  
  let orderBy;
  switch (order) {
    case "oldest":
      orderBy = { createdAt: "asc" }
      break;
    case "newest":
      orderBy = { createdAt: "desc" }
      break;
    default:
      orderBy = { createdAt: "desc" }
  }
  
  return commentRepo.findComments({
    where: { productId: Number(productId) },
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      userId: true
    }
  })
}


// =========================
// 기사(Article) 댓글
// =========================

// 1. article 댓글 생성
export async function createArticleCommentService({ articleId, user, content }) {
  const article = await articleRepo.findArticleById(articleId)
  if (!article) {
    const err = new Error('Article not found')
    err.status = 404;
    throw err;
  }
  
  return commentRepo.createComment({
    content,
    user: { connect: { id: user.id }},
    article: { connect: { id: Number(articleId) }}
  })
}

//2. article 댓글 수정 (실제로는 댓글 수정은 product/article 구분 필요 없음)
export async function updateArticleCommentService({ commentId, user, content }) {
  const comment = await commentRepo.findCommentById(commentId)
  if (!comment) {
    const err = new Error('Comment not found')
    err.status = 404;
    throw err;
  }

  // 권한 확인
  if (comment.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  // { content } 이렇게 객체로 보내면 repositories에서 구조 분해 해서 사용한다.
  return commentRepo.updateComment(commentId, { content })
}

// 3. aritlce 댓글 삭제
// 아규먼트 값이 객체형태로 넘어오는 경우 받는 곳에서 { } 이렇게 받으면 구조분해 하는거고
// 그냥 data로 받으면 그 값 그대로 받아서 { data: data }이거 하려고 하는거같다.
export async function deleteArticleCommentService({ commentId, user }) {
  const comment = await commentRepo.findCommentById(commentId)
  if (!comment) {
    const err = new Error('Comment not found')
    err.status = 404;
    throw err;
  }

  if (comment.userId !== user.id) {
    const err = new Error('Forbidden')
    err.status = 403;
    throw err;
  }

  await commentRepo.deleteComment(commentId)
}


// 4. article 댓글 목록 조회
export async function getArticleCommentsService({
  articleId,
  offset = 0,
  limit = 10,
  order = 'newest'
}) {
  const article = await articleRepo.findArticleById(articleId)
  if (!article) {
    const err = new Error('Article not found')
    err.status = 404;
    throw err;
  }

  let orderBy;
  switch(order) {
    case "oldest":
      orderBy = { createdAt: "asc" }
      break;
    case "newest":
      orderBy = { createdAt: "desc" }
      break;
    default:
      orderBy = { createdAt: "desc" }
  }

  return commentRepo.findComments({
    where: { articleId: Number(articleId) },
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      userId: true
    }
  })
}