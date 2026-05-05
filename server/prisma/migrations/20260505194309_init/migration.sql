-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubAccount" (
    "id" SERIAL NOT NULL,
    "githubId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GitHubAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" SERIAL NOT NULL,
    "githubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "githubAccountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubAccount_githubId_key" ON "GitHubAccount"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubAccount_userId_key" ON "GitHubAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");

-- AddForeignKey
ALTER TABLE "GitHubAccount" ADD CONSTRAINT "GitHubAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_githubAccountId_fkey" FOREIGN KEY ("githubAccountId") REFERENCES "GitHubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
