-- DropForeignKey
ALTER TABLE "modelos" DROP CONSTRAINT "modelos_marca_id_fkey";

-- AddForeignKey
ALTER TABLE "modelos" ADD CONSTRAINT "modelos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
