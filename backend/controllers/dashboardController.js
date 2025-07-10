// backend/controllers/dashboardController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    // Usamos $transaction para rodar várias contagens de forma eficiente
    const [totalEventos, totalUsuarios, totalCategorias, totalInscricoes] = await prisma.$transaction([
      prisma.evento.count(),
      prisma.usuario.count(),
      prisma.categoria.count(),
      prisma.inscricao.count()
    ]);

    // Buscamos os 5 eventos criados mais recentemente
    const eventosRecentes = await prisma.evento.findMany({
      take: 5,
      orderBy: {
        data_criacao: 'desc'
      },
      include: {
        categoria: true // Inclui o nome da categoria
      }
    });

    // Enviamos tudo em um único objeto JSON
    res.status(200).json({
      totalEventos,
      totalUsuarios,
      totalCategorias,
      totalInscricoes,
      eventosRecentes
    });

  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
};

module.exports = { getStats };