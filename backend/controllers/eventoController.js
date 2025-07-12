const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Lista todos os eventos com filtros, busca e paginação
const listarEventos = async (req, res) => {
  const { categoriaId, termoBusca, page = 1, limit = 9 } = req.query;
  const whereConditions = [];
  if (categoriaId) {
    whereConditions.push({ id_categoria: parseInt(categoriaId) });
  }
  if (termoBusca) {
    whereConditions.push({
      OR: [
        { titulo: { contains: termoBusca, mode: 'insensitive' } },
        { descricao_curta: { contains: termoBusca, mode: 'insensitive' } },
      ],
    });
  }
  const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {};
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [eventos, totalEventos] = await prisma.$transaction([
      prisma.evento.findMany({ where: whereClause, orderBy: { data_inicio: 'asc' }, skip, take: limitNum }),
      prisma.evento.count({ where: whereClause }),
    ]);
    const totalPaginas = Math.ceil(totalEventos / limitNum);
    res.status(200).json({ eventos, totalEventos, totalPaginas, paginaAtual: pageNum });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar eventos.' });
  }
};

// Busca um único evento pelo ID
const buscarEventoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const evento = await prisma.evento.findUnique({
      where: { id: parseInt(id) },
    });
    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }
    res.status(200).json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar o evento.' });
  }
};

// Cria um novo evento
// Em backend/controllers/eventoController.js

const criarEvento = async (req, res) => {
  const dadosDoFormulario = req.body;
  const id_criador = req.user.id;

  try {
    // --- VALIDAÇÃO DE SEGURANÇA ADICIONADA AQUI ---
    const idCategoriaNumerico = parseInt(dadosDoFormulario.id_categoria);
    if (isNaN(idCategoriaNumerico)) {
      // Se a categoria não for um número válido, retorna um erro 400 claro.
      return res.status(400).json({ error: "ID de categoria inválido ou não fornecido." });
    }

    let urlImagemFinal = null;
    if (req.file) {
      urlImagemFinal = `http://localhost:3001/uploads/${req.file.filename}`;
    }
    
    const novoEvento = await prisma.evento.create({
      data: {
        ...dadosDoFormulario,
        requer_inscricao: dadosDoFormulario.requer_inscricao === 'true',
        limite_participantes: parseInt(dadosDoFormulario.limite_participantes) || 0,
        data_inicio: new Date(dadosDoFormulario.data_inicio),
        data_fim: dadosDoFormulario.data_fim ? new Date(dadosDoFormulario.data_fim) : null,
        preco: parseFloat(dadosDoFormulario.preco) || 0,
        id_categoria: idCategoriaNumerico, // Usamos a variável já validada e convertida
        id_criador,
        url_imagem: urlImagemFinal,
      }
    });
    res.status(201).json(novoEvento);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ error: "Erro ao criar evento." });
  }
};


const atualizarEvento = async (req, res) => {
  const { id: paramId } = req.params;
  const idUsuarioLogado = req.user.id; // ID do usuário que está fazendo a requisição

  try {
    // 1. Primeiro, buscamos o evento no banco para saber quem é o seu criador.
    const eventoParaAtualizar = await prisma.evento.findUnique({
      where: { id: parseInt(paramId) },
    });

    // Se o evento nem sequer existe, retornamos um erro 404.
    if (!eventoParaAtualizar) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // 2. A VERIFICAÇÃO DE PERMISSÃO: o ID do usuário logado é o mesmo do criador do evento?
    if (eventoParaAtualizar.id_criador !== idUsuarioLogado) {
      // Se não for, ele não tem permissão. Retornamos um erro 403 (Forbidden).
      return res.status(403).json({ error: "Acesso negado. Você não tem permissão para editar este evento." });
    }
    
    // 3. Se a permissão for válida, o resto do código (que já tínhamos) é executado.
    const { id, url_imagem, ...dadosDoFormulario } = req.body;
    
    const dadosParaSalvar = {
      ...dadosDoFormulario,
      requer_inscricao: dadosDoFormulario.requer_inscricao === 'true',
      limite_participantes: parseInt(dadosDoFormulario.limite_participantes) || 0,
      data_inicio: new Date(dadosDoFormulario.data_inicio),
      data_fim: dadosDoFormulario.data_fim ? new Date(dadosDoFormulario.data_fim) : null,
      preco: parseFloat(dadosDoFormulario.preco) || 0,
      id_categoria: parseInt(dadosDoFormulario.id_categoria),
      id_criador: idUsuarioLogado, // Mantemos o criador original
    };

    if (req.file) {
      dadosParaSalvar.url_imagem = `http://localhost:3001/uploads/${req.file.filename}`;
    }

    const eventoAtualizado = await prisma.evento.update({
      where: { id: parseInt(paramId) },
      data: dadosParaSalvar,
    });
    res.status(200).json(eventoAtualizado);

  } catch (error) {
    console.error("ERRO DETALHADO AO ATUALIZAR:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: "Evento não encontrado para atualização." });
    }
    return res.status(500).json({ message: "Erro interno no servidor ao atualizar evento." });
  }
};


const excluirEvento = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user; // Objeto completo do usuário logado (contém id e tipo)

  try {
    // 1. Buscamos o evento no banco para saber quem é o seu criador.
    const eventoParaExcluir = await prisma.evento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!eventoParaExcluir) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // 2. A VERIFICAÇÃO DE PERMISSÃO
    // A condição é: O usuário logado é o dono do evento? OU o tipo do usuário logado é 'ADMIN'?
    if (eventoParaExcluir.id_criador === usuarioLogado.id || usuarioLogado.tipo === 'ADMIN') {
      // Se qualquer uma das condições for verdadeira, ele tem permissão para excluir.
      await prisma.evento.delete({
        where: { id: parseInt(id) },
      });
      return res.status(204).send(); // Sucesso, sem conteúdo de resposta.
    } else {
      // Se nenhuma das condições for verdadeira, o acesso é negado.
      return res.status(403).json({ error: "Acesso negado. Você não tem permissão para excluir este evento." });
    }
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Evento não encontrado para exclusão." });
    }
    res.status(500).json({ error: "Erro ao excluir evento." });
  }
};

// Lista todas as categorias
const listarCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    });
    res.status(200).json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar as categorias.' });
  }
};

// Lista os eventos em destaque
const listarDestaques = async (req, res) => {
  try {
    const eventosDestaque = await prisma.evento.findMany({
      where: {
        data_inicio: { gte: new Date() },
        url_imagem: { not: null },
      },
      orderBy: { data_inicio: 'asc' },
      take: 3,
    });
    res.status(200).json(eventosDestaque);
  } catch (error) {
    console.error("Erro ao buscar eventos em destaque:", error);
    res.status(500).json({ error: 'Erro ao buscar destaques.' });
  }
};

module.exports = {
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  listarCategorias,
  listarDestaques
};