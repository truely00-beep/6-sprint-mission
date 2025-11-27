/*
  Warnings:

  - The primary key for the `LikedArticle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikedArticle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LikedArticle" DROP CONSTRAINT "LikedArticle_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LikedArticle_pkey" PRIMARY KEY ("userId", "articleId");
