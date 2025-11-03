import prisma from '../../prismaclient.js';

export async function getArticle(input) {
  try {
    await prisma.article.findMany({
      where: {
        OR: [
          { id: { contains: input } },
          { title: { contains: input } },
          { content: { contains: input } },
        ],
      },
    });
  } catch (err) {
    console.log(err);
  }
}
