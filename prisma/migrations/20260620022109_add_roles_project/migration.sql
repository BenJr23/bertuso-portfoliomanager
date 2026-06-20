-- AlterTable
ALTER TABLE "project" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY[]::TEXT[];
