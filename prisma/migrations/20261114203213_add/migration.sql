/*
  Warnings:

  - Added the required column `cambio` to the `veiculos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Cambio" AS ENUM ('MANUAL', 'MANUAL_4_MARCHAS', 'MANUAL_5_MARCHAS', 'MANUAL_6_MARCHAS', 'SEMIAUTOMATICO', 'SEMIAUTOMATICO_ROTATIVO', 'AUTOMATICO', 'CVT', 'DCT', 'AMT', 'E_CLUTCH', 'SEQUENCIAL', 'ELETRONICO', 'ELETRICO');

-- AlterTable
ALTER TABLE "veiculos" ADD COLUMN     "cambio" "Cambio" NOT NULL;
