-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "articleLikeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productLikeCount" INTEGER NOT NULL DEFAULT 0;
