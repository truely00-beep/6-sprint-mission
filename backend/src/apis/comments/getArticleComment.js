import prisma from '../../prismaclient.js';

export async function getArticleComments(articleId, cursor) {
  const take = 10;

  const result = await prisma.comment.findMany({
    where: { articleId: articleId },
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
