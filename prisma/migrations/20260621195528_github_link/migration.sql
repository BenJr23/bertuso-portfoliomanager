-- AlterTable
ALTER TABLE "project" ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "previewLink" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "githubLink" TEXT;
