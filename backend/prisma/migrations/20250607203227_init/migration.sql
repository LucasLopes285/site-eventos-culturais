-- CreateEnum
CREATE TYPE "StatusEvento" AS ENUM ('Ativo', 'Inativo', 'Cancelado');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'COMUM');

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'COMUM',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao_curta" VARCHAR(500),
    "descricao_longa" TEXT,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "local" TEXT,
    "endereco" TEXT,
    "url_imagem" VARCHAR(2048),
    "preco" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "requer_inscricao" BOOLEAN NOT NULL DEFAULT false,
    "limite_participantes" INTEGER,
    "classificacao_etaria" VARCHAR(50),
    "organizador" VARCHAR(150),
    "status" "StatusEvento" NOT NULL DEFAULT 'Ativo',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_criador" INTEGER,
    "id_categoria" INTEGER,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
