/*
  Warnings:

  - Added the required column `category` to the `about_me` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AboutMeCategory" AS ENUM ('PERSONAL_BACKGROUND', 'TECHNICAL_EXPERTISE', 'WORK_PHILOSOPHY', 'CAREER_HIGHLIGHTS', 'CONTINUOUS_LEARNING');

-- AlterTable
ALTER TABLE "about_me" ADD COLUMN     "category" "AboutMeCategory" NOT NULL;
