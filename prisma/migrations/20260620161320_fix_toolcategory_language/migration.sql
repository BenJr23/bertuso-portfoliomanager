/*
  Warnings:

  - The values [LANGGUAGE] on the enum `ToolCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ToolCategory_new" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'TESTING', 'VERSION_CONTROL', 'LANGUAGE', 'UI_TOOLKIT', 'MOBILE', 'CLOUD', 'MONITORING', 'SECURITY', 'CACHING_LAYER', 'ORM', 'TASK_SCHEDULING', 'BACKEND_AUTOMATION');
ALTER TABLE "tool" ALTER COLUMN "category" TYPE "ToolCategory_new" USING ("category"::text::"ToolCategory_new");
ALTER TYPE "ToolCategory" RENAME TO "ToolCategory_old";
ALTER TYPE "ToolCategory_new" RENAME TO "ToolCategory";
DROP TYPE "public"."ToolCategory_old";
COMMIT;
