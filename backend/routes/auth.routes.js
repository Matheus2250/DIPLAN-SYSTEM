const express = require('express');
const { register, login, getUser } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/me', authenticateToken, getUser);

module.exports = router;

// Em backend/routes/auth.routes.js
router.post('/login', (req, res) => {
  const token = jwt.sign(
    { id: 1, name: 'Admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  
  res.status(200).json({
    token,
    user: { id: 1, name: 'Admin' }
  });
});