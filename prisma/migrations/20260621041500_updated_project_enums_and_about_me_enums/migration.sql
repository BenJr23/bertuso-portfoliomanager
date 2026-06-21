-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('MOBILE_APPLICATION', 'DESKTOP_APPLICATION', 'WEB_APPLICATION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AboutMeCategory" ADD VALUE 'WORK_EXPERIENCE';
ALTER TYPE "AboutMeCategory" ADD VALUE 'EDUCATIONAL_BACKGROUND';

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'WEB_APPLICATION';
