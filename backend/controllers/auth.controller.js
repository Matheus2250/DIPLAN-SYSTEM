const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

// Registrar novo usuário
const register = async (req, res) => {
  try {
    const { nome, email, senha, departamento, cargo } = req.body;
    
    // Verificar se o usuário já existe
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (users.length > 0) {
      return res.status(400).json({ message: 'Email já registrado' });
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    
    // Inserir novo usuário
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, departamento, cargo) VALUES (?, ?, ?, ?, ?)',
      [nome, email, hashedPassword, departamento, cargo]
    );
    
    // Gerar token
    const token = jwt.sign(
      { id: result.insertId, email, departamento },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: result.insertId,
        nome,
        email,
        departamento,
        cargo
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Verificar se o usuário existe
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    
    const user = users[0];
    
    // Verificar senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    
    // Atualizar último acesso
    await db.query('UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?', [user.id]);
    
    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, departamento: user.departamento },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        departamento: user.departamento,
        cargo: user.cargo
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Informações do usuário atual
const getUser = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, nome, email, departamento, cargo FROM usuarios WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ message: 'Erro ao obter usuário' });
  }
};

module.exports = {
  register,
  login,
  getUser
};