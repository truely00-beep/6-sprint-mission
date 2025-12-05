import prisma from '../lib/prismaclient.js';
import { PRODUCTS, ARTICLES } from './mock.js';

async function seed() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  // await prisma.product.createMany({
  //   data: PRODUCTS,
  //   skipDuplicates: true,
  // });

  // await prisma.article.createMany({
  //   data: ARTICLES,
  //   skipDuplicates: true,
  // });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
