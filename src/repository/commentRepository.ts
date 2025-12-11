import prisma from '../lib/prisma';

class CommentRepository {
  findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  }

  updateComment(id: number, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  deleteComment(id: number) {
    return prisma.comment.delete({
      where: { id },
    });
  }
}

export default new CommentRepository();
