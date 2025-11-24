import express from 'express';
import {
  CreateArticleComment,
  CreateProductComment,
  PatchComment,
} from '../structs/commentStruct.js';
import { validate } from '../middleware/validate.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { commentController } from '../controller/commentController.js';

const commentRouter = express.Router();

//중고마켓 댓글 작성
commentRouter
  .route('/products')
  .post(validate(CreateProductComment), tryCatchHandler(commentController.createProductComment));

//자유게시판 댓글 생성
commentRouter
  .route('/articles')
  .post(validate(CreateArticleComment), tryCatchHandler(commentController.createArticleComment));

//댓글 수정 및 삭제
commentRouter
  .route('/:id')
  .patch(validate(PatchComment), tryCatchHandler(commentController.patchComment))
  .delete(tryCatchHandler(commentController.deleteComment));

//모든 댓글 조회
commentRouter.route('/').get(tryCatchHandler(commentController.deleteComment));

export default commentRouter;
// 프리즈마 문서만 참고해서 커서 옵션을 사용했을 때 시도 >> 실패

// commentRouter.route('/product/:id').get(async (req, res) => {
//   const { limit = 10, id } = req.query;
//   const orderBy = { createdAt: 'asc' };
//   const productComment = prisma.comment.findMany({
//     cursor: {product:{ id:productId }},
//     orderBy,
//     take: parseInt(limit),
//   });
//   res.send(productComment);
// });
//

// commentRouter.route('/product/:id').get(async (req, res) => {
//   const id = req.params;
//   const { limit = 0, cursorId } = req.body;
//   const orderBy = { createdAt: 'asc' };
//   const productComment = await prisma.comment.findMany({
//     where: { id },
//     cursor: orderBy,
//   });
// });
