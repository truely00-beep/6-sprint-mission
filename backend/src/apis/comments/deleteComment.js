import prisma from '../../prismaclient.js';

export async function deleteComment(commentId) {
  await prisma.comment.delete({
    where: { id: commentId },
  });
  await console.log(`Deleted comment: ${commentId}`);
}
