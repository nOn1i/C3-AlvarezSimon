-- AlterTable
ALTER TABLE `Evento` ADD COLUMN `imagen` VARCHAR(191) NULL;
ALTER TABLE `Evento` ADD COLUMN `valor` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Inscripcion` ADD CONSTRAINT `Inscripcion_eventoId_fkey` FOREIGN KEY (`eventoId`) REFERENCES `Evento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
