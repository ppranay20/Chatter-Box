/*
  Warnings:

  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_userChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userChats_AB_unique" ON "_userChats"("A", "B");

-- CreateIndex
CREATE INDEX "_userChats_B_index" ON "_userChats"("B");

-- AddForeignKey
ALTER TABLE "_userChats" ADD CONSTRAINT "_userChats_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userChats" ADD CONSTRAINT "_userChats_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
