/*
  Warnings:

  - A unique constraint covering the columns `[credentialId]` on the table `Authenticator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credentialId` to the `Authenticator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Authenticator" ADD COLUMN     "credentialId" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "createdAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialId_key" ON "Authenticator"("credentialId");
