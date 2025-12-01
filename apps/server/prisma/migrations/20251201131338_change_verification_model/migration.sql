/*
  Warnings:

  - You are about to drop the column `token` on the `verification` table. All the data in the column will be lost.
  - Added the required column `value` to the `verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."verification_token_idx";

-- DropIndex
DROP INDEX "public"."verification_token_key";

-- AlterTable
ALTER TABLE "public"."verification" DROP COLUMN "token",
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "verification_value_idx" ON "public"."verification"("value");
