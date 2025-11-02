import { PrismaClient } from '@prisma/client';
import { products, articles } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  for (const article of articles) {
    await prisma.article.create({ data: article });
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
