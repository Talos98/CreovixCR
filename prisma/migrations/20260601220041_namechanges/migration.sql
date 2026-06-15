/*
  Warnings:

  - You are about to drop the column `status` on the `appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `status`,
    ADD COLUMN `Status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';
