const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Sample Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Vintage Camera',
      description: 'A classic film camera in excellent condition.',
      price: 120.0,
      tags: ['vintage', 'camera', 'photography'],
      imageUrl: '/uploads/vintage-camera.jpg',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Mountain Bike',
      description: 'A sturdy mountain bike suitable for all terrains.',
      price: 450.0,
      tags: ['bike', 'outdoor', 'sports'],
      imageUrl: '/uploads/mountain-bike.jpg',
    },
  });

  // Sample Articles
  const article1 = await prisma.article.create({
    data: {
      title: 'How to Take Great Photos',
      content: 'Photography is an art. Here are some tips to improve your skills...',
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Best Biking Trails in the City',
      content: 'Explore the top biking trails that offer scenic views and great exercise...',
    },
  });

  // Comments for Products
  await prisma.comment.createMany({
    data: [
      {
        content: 'Is this camera still available?',
        productId: product1.id,
      },
      {
        content: 'Can you lower the price?',
        productId: product2.id,
      },
    ],
  });

  // Comments for Articles
  await prisma.comment.createMany({
    data: [
      {
        content: 'Thanks for the tips!',
        articleId: article1.id,
      },
      {
        content: 'I love biking on those trails too!',
        articleId: article2.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('🌱 Seeding completed.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });