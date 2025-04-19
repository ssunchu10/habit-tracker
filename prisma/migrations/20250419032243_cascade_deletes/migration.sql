-- DropForeignKey
ALTER TABLE `habit` DROP FOREIGN KEY `Habit_userId_fkey`;

-- DropForeignKey
ALTER TABLE `habitlog` DROP FOREIGN KEY `Habitlog_habitId_fkey`;

-- DropIndex
DROP INDEX `Habit_userId_fkey` ON `habit`;

-- DropIndex
DROP INDEX `Habitlog_habitId_fkey` ON `habitlog`;

-- AddForeignKey
ALTER TABLE `Habit` ADD CONSTRAINT `Habit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Habitlog` ADD CONSTRAINT `Habitlog_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
