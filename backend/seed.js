import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 더미 데이터를 만들기 위한 헬퍼 데이터 (이전과 동일)
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

  // 50번 반복
  for (let i = 1; i <= 50; i++) {
    // 1. 고유한 이름 생성 (where 절을 위해)
    const baseName = productNames[i % productNames.length];
    const adj = adjectives[i % adjectives.length];
    const uniqueName = `${adj} ${baseName} #${i}`; // 'where' 조건용 고유 이름

    // 2. 임의의 데이터 생성
    const description = `This is a ${adj.toLowerCase()} ${baseName.toLowerCase()}. Serial number: ${i}.`;
    const price = (Math.floor(Math.random() * 1000) + 100) * 100;
    const tags = allTags[i % allTags.length];

    // 3. 개별적으로 upsert 실행 (요청하신 방식)
    // 루프가 돌 때마다 데이터베이스에 1번씩 쿼리를 보냅니다.
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

    // (선택사항) 진행 상황 확인
    console.log(`Processed product #${i}: ${product.name}`);
  }

  console.log('Seeding finished. 50 products processed individually.');
}

// 스크립트 실행 부분 (기존과 동일)
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
