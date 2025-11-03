import prisma from '../../prismaclient.js';
export async function searchAll(skip, take, keyword) {
  const result = await prisma.product.findMany({
    skip: skip,
    take: take,

    where: {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
        { tags: { has: keyword } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (result.length === 0) {
    console.log('there is no such product');
  } else {
    return result;
  }
}
