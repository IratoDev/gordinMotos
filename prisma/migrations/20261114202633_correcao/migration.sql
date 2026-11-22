/*
  Warnings:

  - You are about to drop the column `opicionais` on the `veiculos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "veiculos" DROP COLUMN "opicionais",
ADD COLUMN     "opcionais" TEXT;
