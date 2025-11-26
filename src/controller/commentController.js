import prisma from '../lib/prisma.js';
import { assert } from 'superstruct';
import { PatchComment } from '../structs/commentStructs.js';

class CommentController {
  async updateComment(req, res) {
    assert(req.body, PatchComment);

    const { id } = req.params;
    const comments = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content: req.body.content },
    });
    res.send(comments);
  }
  async deleteComment(req, res) {
    const { id } = req.params;
    const comments = await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.sendStatus(204);
  }
}

export default new CommentController();
