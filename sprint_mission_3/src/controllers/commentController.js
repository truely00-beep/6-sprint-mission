import { prisma } from "../lib/prismaClient.js";
import { assert } from "superstruct";
import { CreateComment, PatchComment } from "../struct.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

/////////////// 상품(Product) ///////////////
// 로그인 한 유저가 상품_댓글 생성
// http://localhost:3000/products/:productId/comments
export const createProductComment = asyncHandler(async (req, res) => {
  assert(req.body, CreateComment);
  const { productId } = req.params;
  const { content } = req.body;
  const user = req.user;

  // 우선 해당 productId에 해당하는 상품이 있는지 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  if (!product) {
    return res.status(403).json({ message: "Product not found" });
  }

  // 아직 comment를 생성 안했기 때문에 if(comment.userId !== user.id)는 할 수 없다.

  // 로그인 한 유저가 productId로 FK 연결되어있는 product의 comment 생성
  const comment = await prisma.comment.create({
    data: {
      content,
      user: {
        connect: { id: user.id },
      },
      product: {
        connect: { id: Number(productId) },
      },
    },
  });
  res.status(201).send(comment);
});

// 로그인 한 유저가 등록한 상품_Comment 수정
// http://localhost:3000/comments/products/:commentId
export const patchComment_Product = asyncHandler(async (req, res) => {
  // console.log(req.body)
  assert(req.body, PatchComment);
  const { commentId } = req.params;
  const { content } = req.body;
  const user = req.user;

  // commentId의 comment가 존재하는지 확인
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // comment를 등록한 user와 로그인 한 유저가 같은지 확인
  if (comment.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updated_comment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: {
      content,
      // userId, productId를 안쓰면 이전에 값이 그대로 적용된다.
    },
  });
  res.status(200).send(updated_comment);
});

// 로그인 한 유저가 등록한 상품_Comment 삭제
// http://localhost:3000/comments/products/:commentId
export const deleteComment_Product = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;

  // 입력한 commentId가 존재하는지 확인
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // comment를 등록한 user와 로그인 한 유저가 같은지 확인
  if (comment.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.comment.delete({
    where: { id: Number(commentId) },
  });
  res.status(204).send();
});

// // 상품(Product) 댓글 조회
// // http://localhost:3000/products/:productId/comments
// export const getProductComment = asyncHandler(async(req, res) => {
//   const { productId } = req.params
//   const existingProduct = await prisma.product.findUniqueOrThrow({
//     where: { id: productId }
//   })
//   if (!existingProduct) {
//     throw new Error("NotFoundError")
//   }

//   const comments = await prisma.comment.findMany({
//     where: { productId },
//     select: {
//       id: true,
//       content: true,
//       createdAt: true
//     }
//   })
//   res.status(200).send(comments)
// })

/////////////// 기사(Article) ///////////////

// 기사(article) 댓글 생성 // http://localhost:3000/articles/:articleId/comments
export const createArticleComment = asyncHandler(async (req, res) => {
  assert(req.body, CreateComment);
  const { articleId } = req.params;
  const { content } = req.body;
  const user = req.user;

  // articleId로 입력한 id가 article테이블에 존재하는지 확인
  const article = await prisma.article.findUnique({
    where: { id: Number(articleId) },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // 아직 comment를 생성 안했기 떄문에 if (comment.userId !== user.id)는 할 수 없다.

  // 특정 article 댓글 생성하기
  const comment = await prisma.comment.create({
    data: {
      content,
      user: {
        connect: { id: user.id }, // user모델의 id(PK)가 user.id인 row(데이터)와 관계를 맺고 이 PK가 comment 테이블의 FK가 된다.
      },
      article: {
        connect: { id: Number(articleId) },
      },
    },
  });
  res.status(201).send(comment);
});

// 기사(article) 댓글 수정 // http://localhost:3000/comments/articles/:commentId
export const patchComment_Article = asyncHandler(async (req, res) => {
  assert(req.body, PatchComment);
  const { commentId } = req.params;
  const data = req.body;
  const user = req.user;

  // commentId의 해당하는 댓글이 comment 테이블에 있는지 확인
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // 로그인 한 유저가 등록한 댓글인지 확인
  if (comment.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // 댓글 수정
  const updated_comment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data
  });
  res.status(200).send(updated_comment);
});

// 기사(article) 댓글 삭제 // http://localhost:3000/comments/articles/:commentId
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

// // 기사(article) 댓글 조회 // http://localhost:3000/articles/:articleId/comments
// export const getArticleComment = asyncHandler(async(req, res) => {
//   const { articleId } = req.params

//   const existingArticle = await prisma.article.findUniqueOrThrow({
//     where: { id: articleId }
//   })
//   if (!existingArticle) {
//     throw new Error("NotFoundError")
//   }

//   const articles = await prisma.comment.findMany({
//     where: { articleId },
//     select: {
//       id: true,
//       content: true,
//       createdAt: true
//     }
//   })
//   res.status(200).send(articles)
// })
