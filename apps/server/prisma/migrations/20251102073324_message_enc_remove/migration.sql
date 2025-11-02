/*
  Warnings:

  - You are about to drop the column `contentEnc` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `Message` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "contentEnc",
DROP COLUMN "iv",
ADD COLUMN     "content" TEXT NOT NULL;
