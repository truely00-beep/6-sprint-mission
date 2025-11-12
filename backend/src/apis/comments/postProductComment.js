import prisma from '../../prismaclient.js';

export async function postProductComment(productId, content) {
  const result = await prisma.comment.create({
    data: {
      content: content,
      productId: productId,
    },
  });
  return result;
}
