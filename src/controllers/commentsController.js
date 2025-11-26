import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';

export async function updateComment(req, res) {
  const userId = req.userId;
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== userId) {
    throw new UnauthorizedError('댓글을 수정할 권한이 없습니다.');
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req, res) {
  const userId = req.userId;
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== userId) {
    throw new UnauthorizedError('댓글을 삭제할 권한이 없습니다.');
  }

  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send();
}
