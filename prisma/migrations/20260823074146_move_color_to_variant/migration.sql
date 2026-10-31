/*
  Warnings:

  - You are about to drop the column `colorId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_colorId_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "colorId",
ADD COLUMN     "colorCode" TEXT,
ADD COLUMN     "colorName" TEXT;

-- DropTable
DROP TABLE "Color";
