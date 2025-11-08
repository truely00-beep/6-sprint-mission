import type { PrismaConfig } from "prisma";

export default {
  schema: "prisma",  // 또는 "prisma/schema.prisma" 대신 "prisma" 폴더만 지정
} satisfies PrismaConfig;
