const express = require('express');
const router = express.Router();

// Importando o middleware de upload com a configuração local
const upload = require('../config/multerConfig');

// Importando os middlewares de verificação de permissão
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

// Importando todas as funções do nosso controller de eventos
const { 
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  listarCategorias,
  listarDestaques,
} = require('../controllers/eventoController');

// --- ROTAS PÚBLICAS (não precisam de login) ---
// A ordem aqui é importante: as mais específicas vêm antes das dinâmicas
router.get('/eventos/destaques', listarDestaques);
router.get('/eventos/:id', buscarEventoPorId);
router.get('/eventos', listarEventos);
router.get('/categorias', listarCategorias);

// --- ROTAS DE ADMIN (precisam de login de admin) ---

// Rota para criar um novo evento
router.post('/eventos', verifyToken, upload.single('imagem'), criarEvento);

// Rota para atualizar um evento existente 
router.put('/eventos/:id', verifyToken, upload.single('imagem'), atualizarEvento);

// Rota para excluir um evento 
router.delete('/eventos/:id', verifyToken, excluirEvento);



module.exports = router;