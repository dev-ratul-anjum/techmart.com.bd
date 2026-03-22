/*
  Warnings:

  - You are about to drop the column `categories_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `outOfStock` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER', 'UPCOMING');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categories_id",
DROP COLUMN "outOfStock",
ADD COLUMN     "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK',
ALTER COLUMN "discountPrice" DROP NOT NULL,
ALTER COLUMN "regularPrice" DROP NOT NULL;

-- DropEnum
DROP TYPE "OutOfStock";

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
