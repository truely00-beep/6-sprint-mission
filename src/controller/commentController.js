import prisma from '../lib/prisma.js';
import { assert } from 'superstruct';
import { PatchComment } from '../structs/commentStructs.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

class CommentController {
  async updateComment(req, res) {
    assert(req.body, PatchComment);

    const { id } = req.params;
    const { content } = req.body;
    const loginUser = req.user;

    const existingComment = await prisma.comment.findUnique({ where: id });
    if (existingComment.userId !== loginUser.id) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const comments = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });
    res.send(comments);
  }
  async deleteComment(req, res) {
    const { id } = req.params;
    const loginUser = req.user;
    const existingComment = await prisma.comment.findUnique({ where: id });
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
