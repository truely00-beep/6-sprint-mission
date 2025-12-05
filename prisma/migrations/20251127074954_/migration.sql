/*
  Warnings:

  - You are about to drop the column `likeCount` on the `ArticleLikes` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `ProductLikes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArticleLikes" DROP COLUMN "likeCount",
ADD COLUMN     "likeCountBool" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ProductLikes" DROP COLUMN "likeCount",
ADD COLUMN     "likeCountBool" BOOLEAN NOT NULL DEFAULT true;
