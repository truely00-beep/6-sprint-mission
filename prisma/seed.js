import { PrismaClient } from '@prisma/client';
import { mockArticles, mockProducts } from '../src/utils/mock.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();

  for (const articleData of mockArticles) {
    await prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        comments: {
          create: articleData.comments,
        },
      },
    });
  }

  for (const productData of mockProducts) {
    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        tags: productData.tags,
        comments: {
          create: productData.comments,
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
