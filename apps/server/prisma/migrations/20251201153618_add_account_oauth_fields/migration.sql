-- AlterTable
ALTER TABLE "public"."Account" ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "scope" TEXT;
