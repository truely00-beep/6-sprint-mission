import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const productNames = [
  'Awesome Gadget',
  'Sleek Widget',
  'Rustic Device',
  'Smart Thing',
  'Wireless Mouse',
  'Mechanical Keyboard',
  '4K Monitor',
  'Noise-Cancelling Headphones',
  'Ergonomic Chair',
  'Standing Desk',
];
const adjectives = ['Refurbished', 'Brand New', 'Premium', 'Generic', 'Handmade', 'Intelligent'];
const allTags = [
  ['tech', 'office'],
  ['home', 'gadget'],
  ['wearable'],
  ['accessory', 'sale'],
  ['essentials'],
];

async function main() {
  console.log('Seeding started (individual upsert mode)...');


  for (let i = 1; i <= 50; i++) {
    // 1. 고유한 이름 생성 (where 절을 위해)
    const baseName = productNames[i % productNames.length];
    const adj = adjectives[i % adjectives.length];
    const uniqueName = `${adj} ${baseName} #${i}`; // 'where' 조건용 고유 이름


    const description = `This is a ${adj.toLowerCase()} ${baseName.toLowerCase()}. Serial number: ${i}.`;
    const price = (Math.floor(Math.random() * 1000) + 100) * 100;
    const tags = allTags[i % allTags.length];


    const product = await prisma.product.upsert({
      where: { name: uniqueName },
      update: {
        price: price, // 이미 존재하면 가격만 업데이트
      },
      create: {
        name: uniqueName,
        description: description,
        price: price,
        tags: tags,
      },
    });

    console.log(`Processed product #${i}: ${product.name}`);
  }

  console.log('Seeding finished. 50 products processed individually.');
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
