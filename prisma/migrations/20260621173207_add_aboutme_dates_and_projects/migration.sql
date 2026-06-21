-- AlterTable
ALTER TABLE "about_me" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isPresent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "aboutMeId" TEXT;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_aboutMeId_fkey" FOREIGN KEY ("aboutMeId") REFERENCES "about_me"("id") ON DELETE SET NULL ON UPDATE CASCADE;
