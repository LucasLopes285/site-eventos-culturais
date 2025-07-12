// backend/controllers/usuarioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMeusEventos = async (req, res) => {
  const idUsuarioLogado = req.user.id;

  try {
    // Busca os eventos que o usuário CRIOU
    const eventosCriados = await prisma.evento.findMany({
      where: {
        id_criador: idUsuarioLogado,
      },
      orderBy: {
        data_criacao: 'desc'
      }
    });

    // Busca os eventos em que o usuário se INSCREVEU
    const inscricoes = await prisma.inscricao.findMany({
      where: {
        usuarioId: idUsuarioLogado, // <<< A CORREÇÃO ESTÁ AQUI
      },
      include: {
        evento: true,
      },
    });

    const eventosInscritos = inscricoes.map(inscricao => inscricao.evento);

    res.status(200).json({ eventosCriados, eventosInscritos });

  } catch (error) {
    console.error("Erro ao buscar 'Meus Eventos':", error);
    res.status(500).json({ error: "Erro ao buscar os eventos do usuário." });
  }
};

module.exports = { getMeusEventos };