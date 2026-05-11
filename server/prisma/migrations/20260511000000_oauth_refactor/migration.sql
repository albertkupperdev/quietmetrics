-- Drop dependent tables first
DROP TABLE IF EXISTS "Repository";
DROP TABLE IF EXISTS "GitHubAccount";

-- Remove old columns from User
ALTER TABLE "User" DROP COLUMN "email";
ALTER TABLE "User" DROP COLUMN "passwordHash";

-- Add new OAuth columns
ALTER TABLE "User" ADD COLUMN "githubId" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "login" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ADD COLUMN "name" TEXT;
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN "accessToken" TEXT NOT NULL DEFAULT '';

-- Remove defaults (only needed for the migration step)
ALTER TABLE "User" ALTER COLUMN "githubId" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "login" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "accessToken" DROP DEFAULT;

-- Add unique constraint
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
