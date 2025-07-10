// backend/controllers/inscricaoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const inscreverEmEvento = async (req, res) => {
  const eventoId = parseInt(req.params.id);
  const usuarioId = req.user.id; // Vem do nosso middleware verifyToken

  try {
    const novaInscricao = await prisma.inscricao.create({
      data: {
        usuarioId,
        eventoId,
      },
    });
    res.status(201).json(novaInscricao);
  } catch (error) {
    // Código P2002 significa que a restrição de unicidade falhou (usuário já inscrito)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Você já está inscrito neste evento.' });
    }
    console.error("Erro ao criar inscrição:", error);
    res.status(500).json({ error: 'Não foi possível se inscrever no evento.' });
  }
};

const cancelarInscricao = async (req, res) => {
  const eventoId = parseInt(req.params.id);
  const usuarioId = req.user.id;

  try {
    // Para deletar, usamos o índice único composto que criamos no schema
    await prisma.inscricao.delete({
      where: {
        usuarioId_eventoId: {
          usuarioId,
          eventoId,
        },
      },
    });
    res.status(204).send(); // Sucesso, sem conteúdo
  } catch (error) {
    // Código P2025 significa que o registro a ser deletado não foi encontrado
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }
    console.error("Erro ao cancelar inscrição:", error);
    res.status(500).json({ error: 'Não foi possível cancelar a inscrição.' });
  }
};


const listarMinhasInscricoes = async (req, res) => {
  const usuarioId = req.user.id;
  try {
    const inscricoes = await prisma.inscricao.findMany({
      where: { usuarioId },
      include: { // Inclui os dados completos do evento relacionado
        evento: true,
      },
      orderBy: {
        evento: { data_inicio: 'asc' }
      }
    });
    res.status(200).json(inscricoes);
  } catch (error) {
    console.error("Erro ao listar inscrições:", error);
    res.status(500).json({ error: 'Não foi possível buscar suas inscrições.' });
  }
};

const verificarStatusInscricao = async (req, res) => {
  const eventoId = parseInt(req.params.id);
  const usuarioId = req.user.id;
  try {
    const inscricao = await prisma.inscricao.findUnique({
      where: { usuarioId_eventoId: { usuarioId, eventoId } },
    });
    // Retorna um booleano simples: true se a inscrição existe, false se não
    res.status(200).json({ inscrito: !!inscricao });
  } catch (error) {
    console.error("Erro ao verificar status da inscrição:", error);
    res.status(500).json({ error: 'Não foi possível verificar a inscrição.' });
  }
};


module.exports = { inscreverEmEvento, cancelarInscricao, listarMinhasInscricoes, verificarStatusInscricao };