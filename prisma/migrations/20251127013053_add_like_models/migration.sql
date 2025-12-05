/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Article` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CommentArticle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CommentArticle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CommentProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CommentProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id,email,nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `articleId` on the `CommentArticle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `CommentProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CommentArticle" DROP CONSTRAINT "CommentArticle_articleId_fkey";

-- DropForeignKey
ALTER TABLE "CommentProduct" DROP CONSTRAINT "CommentProduct_productId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CommentArticle" DROP CONSTRAINT "CommentArticle_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL,
ADD CONSTRAINT "CommentArticle_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CommentProduct" DROP CONSTRAINT "CommentProduct_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "CommentProduct_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ProductLikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "likeCount" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleLikes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "likeCount" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_nickname_key" ON "User"("id", "email", "nickname");

-- AddForeignKey
ALTER TABLE "CommentProduct" ADD CONSTRAINT "CommentProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentArticle" ADD CONSTRAINT "CommentArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLikes" ADD CONSTRAINT "ProductLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLikes" ADD CONSTRAINT "ProductLikes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleLikes" ADD CONSTRAINT "ArticleLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleLikes" ADD CONSTRAINT "ArticleLikes_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
