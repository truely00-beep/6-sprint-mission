import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient 인스턴스를 생성하고 로그 설정을 적용합니다.
 * 개발 환경에서는 쿼리 로그를 포함하여 상세 로그를 출력합니다.
 */
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'], // 프로덕션 환경에서는 에러만 로깅
});

export default prisma;
