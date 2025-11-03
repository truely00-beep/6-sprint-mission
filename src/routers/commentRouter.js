import express from 'express';

import {
  getCommentById,
  patchCommentById,
  deleteCommentById,
} from '../controllers/commentController.js';

const router = express.Router();

router
  .route('/:id')
  //GET id //PATCH id //DELETE id
  .get(getCommentById)
  .patch(patchCommentById)
  .delete(deleteCommentById);

export default router;
