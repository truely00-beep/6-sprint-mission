import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { assert } from 'superstruct';
import type { PatchCommentType } from '../structs/commentStructs';
import { PatchComment } from '../structs/commentStructs';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import { AuthenticatedRequest } from '../types/auth';

class CommentController {
  async updateComment(
    req: AuthenticatedRequest<{ id: number }, any, PatchCommentType>,
    res: Response,
  ) {
    assert(req.body, PatchComment);

    const { id } = req.params;
    const { content } = req.body;
    const loginUser = req.user;

    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment) {
      throw new NotFoundError('댓글이 존재하지 않습니다.');
    }
    if (existingComment.userId !== loginUser.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const comments = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });
    res.send(comments);
  }
  async deleteComment(req: AuthenticatedRequest<{ id: number }>, res: Response) {
    const { id } = req.params;
    const loginUser = req.user;
    const existingComment = await prisma.comment.findUnique({ where: { id } });

    if (!existingComment) {
      throw new NotFoundError('댓글이 존재하지 않습니다.');
    }

    if (existingComment.userId !== loginUser.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const comments = await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  }
}

export default new CommentController();
