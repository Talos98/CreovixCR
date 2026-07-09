/*
  Warnings:

  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ProfessionalProfile_title_key` ON `professionalprofile`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `lastName` VARCHAR(120) NOT NULL;
