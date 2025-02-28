/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `TempOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TempOrder_orderId_key" ON "TempOrder"("orderId");
