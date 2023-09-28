/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_userId_key" ON "Challenge"("userId");
