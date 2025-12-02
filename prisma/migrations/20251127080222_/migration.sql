/*
  Warnings:

  - The primary key for the `LikedProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikedProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LikedProduct" DROP CONSTRAINT "LikedProduct_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LikedProduct_pkey" PRIMARY KEY ("userId", "productId");
