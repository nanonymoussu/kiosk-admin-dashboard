/*
  Warnings:

  - You are about to drop the column `createdAt` on the `TempOrder` table. All the data in the column will be lost.
  - You are about to alter the column `totalPrice` on the `TempOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TempOrder" DROP COLUMN "createdAt",
ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER;
