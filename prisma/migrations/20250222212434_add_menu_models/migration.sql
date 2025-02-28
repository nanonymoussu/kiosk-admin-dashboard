-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "nameTH" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "menuCategoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOption" (
    "id" SERIAL NOT NULL,
    "nameTH" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "OrderOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOptionChoice" (
    "id" SERIAL NOT NULL,
    "nameTH" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "orderOptionId" INTEGER NOT NULL,

    CONSTRAINT "OrderOptionChoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOptionChoice" ADD CONSTRAINT "OrderOptionChoice_orderOptionId_fkey" FOREIGN KEY ("orderOptionId") REFERENCES "OrderOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
