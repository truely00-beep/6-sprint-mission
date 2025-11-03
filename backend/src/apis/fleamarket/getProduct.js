import prisma from '../../prismaclient.js';
export async function getProduct(string) {
  const input = { data: string };
  const result = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: input.data } },
        { description: { contains: input.data } },
        { tags: { has: input.data } },
      ],
    },
  });
  return result;
}
