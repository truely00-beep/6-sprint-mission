import prisma from '../../prismaclient.js';

export async function getProductComments(productId, cursor) {
  const take = 10;

  const result = await prisma.comment.findMany({
    where: { productId: productId },
    take: take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return result;
}
