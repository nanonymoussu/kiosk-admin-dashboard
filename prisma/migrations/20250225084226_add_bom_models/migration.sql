-- CreateTable
CREATE TABLE "BOM" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BOMIngredient" (
    "id" SERIAL NOT NULL,
    "bomId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BOMIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BOM_menuItemId_key" ON "BOM"("menuItemId");

-- CreateIndex
CREATE UNIQUE INDEX "BOMIngredient_bomId_inventoryId_key" ON "BOMIngredient"("bomId", "inventoryId");

-- AddForeignKey
ALTER TABLE "BOM" ADD CONSTRAINT "BOM_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOMIngredient" ADD CONSTRAINT "BOMIngredient_bomId_fkey" FOREIGN KEY ("bomId") REFERENCES "BOM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOMIngredient" ADD CONSTRAINT "BOMIngredient_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
