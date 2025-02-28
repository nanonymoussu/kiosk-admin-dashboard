/*
  Warnings:

  - Added the required column `time` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `TempOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderHistory" ADD COLUMN     "time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TempOrder" ADD COLUMN     "time" TEXT NOT NULL;
