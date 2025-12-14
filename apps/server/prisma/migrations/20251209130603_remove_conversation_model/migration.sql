/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_canvasId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "conversationId";

-- DropTable
DROP TABLE "public"."Conversation";
