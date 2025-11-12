import prisma from '../../prismaclient.js';

export async function patchComment(commentId, content) {
  const result = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content: content,
    },
  });
  return result;
}
