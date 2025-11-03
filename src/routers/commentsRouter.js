import { Router } from 'express';
import * as commentsController from '../controllers/commentsController.js';
import { validateCursorPagination } from '../middlewares/validateCursorPagination.js';
import { validate } from '../middlewares/validate.js';
import { CreateCommentSchema, PatchCommentSchema } from '../validations/commentsSchema.js';

const router = Router({ mergeParams: true });

router.post('/', validate(CreateCommentSchema, 'body'), commentsController.createComment);

router.get('/', validateCursorPagination, commentsController.getComments);

router.patch('/:id', validate(PatchCommentSchema, 'body'), commentsController.patchComment);

router.delete('/:id', commentsController.deleteComment);

export default router;
