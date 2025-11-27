/*
  Warnings:

  - You are about to drop the column `likeArticleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `likeProductId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "likeArticleId",
DROP COLUMN "likeProductId";

-- CreateTable
CREATE TABLE "LikedProduct" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "LikedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedArticle" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "LikedArticle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedProduct" ADD CONSTRAINT "LikedProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedProduct" ADD CONSTRAINT "LikedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedArticle" ADD CONSTRAINT "LikedArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedArticle" ADD CONSTRAINT "LikedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
