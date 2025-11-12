import { PrismaClient } from '@prisma/client';
import { mockProducts, mockArticles } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  const createdProducts = await Promise.all(
    mockProducts.map((product) => prisma.product.create({ data: product }))
  );

  const createdArticles = await Promise.all(
    mockArticles.map((article) => prisma.article.create({ data: article }))
  );
}

main()
  .catch((e) => {
    console.error('시드 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
