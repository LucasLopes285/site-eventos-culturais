// backend/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função de Registro
const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // 1. Verifica se o email já está em uso
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }

    // 2. Cria o "hash" da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 3. Cria o usuário no banco de dados
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash, // Salva a senha com hash, não a senha original!
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: novoUsuario.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

// Função de Login
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Encontra o usuário pelo email
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // 2. Compara a senha fornecida com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    // 3. Se a senha for válida, cria um Token JWT
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo }, // O que será salvo no token
      process.env.JWT_SECRET,                  // A chave secreta
      { expiresIn: '1h' }                     // Duração do token
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

module.exports = { register, login };