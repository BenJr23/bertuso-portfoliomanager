-- AlterTable
ALTER TABLE "user" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
