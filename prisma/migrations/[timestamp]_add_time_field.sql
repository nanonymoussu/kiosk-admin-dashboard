-- First add the columns as nullable
ALTER TABLE "OrderHistory" ADD COLUMN "time" TEXT;
ALTER TABLE "TempOrder" ADD COLUMN "time" TEXT;

-- Update existing records with a default time
UPDATE "OrderHistory" SET "time" = '00:00:00' WHERE "time" IS NULL;
UPDATE "TempOrder" SET "time" = '00:00:00' WHERE "time" IS NULL;

-- Make the columns required
ALTER TABLE "OrderHistory" ALTER COLUMN "time" SET NOT NULL;
ALTER TABLE "TempOrder" ALTER COLUMN "time" SET NOT NULL;
