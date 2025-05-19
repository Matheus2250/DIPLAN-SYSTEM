const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const contratacaoRoutes = require('./routes/contratacao.routes');
const uploadRoutes = require('./routes/upload.routes');

// Inicializar app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Diretório de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir rotas
app.use('/api/auth', authRoutes);
app.use('/api/contratacoes', contratacaoRoutes);
app.use('/api/upload', uploadRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Sistema DIPLAN/DIPLI' });
});

// Porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});