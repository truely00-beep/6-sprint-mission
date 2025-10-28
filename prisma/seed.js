import { PrismaClient } from '@prisma/client';
import { USERS, PRODUCTS } from './mock.js';

const prisma = new PrismaClient();

async function main() {
  //기존 데이터 잔존시 시드를 재실행 했을 때 꼬일 수 있으므로 삭제 코드 추가
  await prisma.users.deleteMany();
  await prisma.products.deleteMany();

  //목데이터 삽입
  await prisma.users.createMany({
    data: USERS,
    skipDuplicates: true,
  });

  await prisma.products.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });
}

//실행기능
main()
  .catch((e) => {
    console.error('에러 캐치!:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('데이터베이스 연결 종료');
  });

//npx prisma db seed
