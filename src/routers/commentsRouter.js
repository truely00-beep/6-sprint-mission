import { Router } from 'express';
import * as commentsController from '../controllers/commentsController.js';
import { validateCursorPagination } from '../middlewares/validateCursorPagination.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { CreateCommentSchema, PatchCommentSchema } from '../validations/commentsSchema.js';

const router = Router({ mergeParams: true });

router.post(
  '/',
  authenticate,
  validate(CreateCommentSchema, 'body'),
  commentsController.createComment,
);

router.get('/', validateCursorPagination, commentsController.getComments);

router.patch(
  '/:commentId',
  authenticate,
  validate(PatchCommentSchema, 'body'),
  commentsController.patchComment,
);

router.delete('/:commentId', authenticate, commentsController.deleteComment);

export default router;
