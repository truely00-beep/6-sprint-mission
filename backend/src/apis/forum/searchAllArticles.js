import prisma from '../../prismaclient.js';

export async function searchAll(skip, take, keyword) {
  const result = await prisma.article.findMany({
    skip: skip,
    take: take,

    where: {
      OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (result.length === 0) {
    console.log('there is no such Article');
  } else {
    return result;
  }
}
