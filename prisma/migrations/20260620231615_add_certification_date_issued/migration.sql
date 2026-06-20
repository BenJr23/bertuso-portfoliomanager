-- AlterEnum
ALTER TYPE "ToolCategory" ADD VALUE 'API';

-- AlterTable
ALTER TABLE "certification" ADD COLUMN     "dateIssued" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
