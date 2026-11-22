/*
  Warnings:

  - A unique constraint covering the columns `[descricao]` on the table `categorias_veiculos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `marcas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "avaliacao" DROP CONSTRAINT "avaliacao_veiculo_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "categorias_veiculos_descricao_key" ON "categorias_veiculos"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_descricao_key" ON "marcas"("descricao");

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
