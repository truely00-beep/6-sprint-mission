import { Request, Response } from 'express';
import { create } from 'superstruct';
import { CommentService } from '../services/commentService.js';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

const commentService = new CommentService();

export async function updateComment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateCommentBodyStruct);
  const comment = await commentService.updateComment(id, req.user.id, data);
  res.send(comment);
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteComment(id, req.user.id);
  res.status(204).send();
}

