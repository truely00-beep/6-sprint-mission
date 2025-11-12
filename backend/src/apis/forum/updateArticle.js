import prisma from '../../prismaclient.js';

export async function updateArticle(input) {
  await prisma.article.upsert({
    where: { name: input.name },
    create: {
      name: input.name,
      description: input.description,
      tags: input.tags,
      price: input.price,
    },
    update: { description: input.description, tags: input.tags, price: input.price },
  });
  await console.log('patch is finished');
}
