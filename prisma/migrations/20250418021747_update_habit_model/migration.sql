/*
  Warnings:

  - You are about to drop the column `name` on the `habit` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `habit` DROP COLUMN `name`,
    ADD COLUMN `daysOfWeek` VARCHAR(191) NOT NULL DEFAULT 'Everyday',
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `description` TEXT NULL;
