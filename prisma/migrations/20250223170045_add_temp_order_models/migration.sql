-- CreateTable
CREATE TABLE "TempOrder" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TempOrder_pkey" PRIMARY KEY ("id")
);
