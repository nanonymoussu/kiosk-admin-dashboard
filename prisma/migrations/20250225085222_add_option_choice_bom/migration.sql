/*
  Warnings:

  - A unique constraint covering the columns `[optionChoiceId]` on the table `BOM` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "BOM" DROP CONSTRAINT "BOM_menuItemId_fkey";

-- AlterTable
ALTER TABLE "BOM" ADD COLUMN     "optionChoiceId" INTEGER,
ALTER COLUMN "menuItemId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BOM_optionChoiceId_key" ON "BOM"("optionChoiceId");

-- AddForeignKey
ALTER TABLE "BOM" ADD CONSTRAINT "BOM_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOM" ADD CONSTRAINT "BOM_optionChoiceId_fkey" FOREIGN KEY ("optionChoiceId") REFERENCES "OrderOptionChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
