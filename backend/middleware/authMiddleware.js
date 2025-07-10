// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Anexa os dados do usuário (id, tipo) à requisição
    next(); // Permite que a requisição continue
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};


const verifyAdmin = (req, res, next) => {
  // 1. Pega o token do cabeçalho 'Authorization'
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = authHeader.substring(7); // Remove o "Bearer " do início

  try {
    // 2. Verifica se o token é válido e decodifica
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Verifica se o tipo do usuário no token é 'ADMIN'
    if (decoded.tipo !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
    }

    // 4. Se tudo estiver ok, anexa os dados do usuário à requisição e continua
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

module.exports = { verifyAdmin, verifyToken };