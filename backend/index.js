// backend/index.js

const express = require('express');
const cors = require('cors');

// Importamos nosso novo arquivo de rotas
const eventoRoutes = require('./routes/eventoRoutes');
const authRoutes = require('./routes/authRoutes'); 
const inscricaoRoutes = require('./routes/inscricaoRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// Torna a pasta 'public/uploads' acessível publicamente pela rota '/uploads'
app.use('/uploads', express.static('public/uploads'));

// Dizemos ao Express para usar o 'eventoRoutes' para qualquer
// requisição que comece com o prefixo '/api'
app.use('/api', eventoRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api', inscricaoRoutes); 
app.use('/api', dashboardRoutes); 
app.use('/api', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});