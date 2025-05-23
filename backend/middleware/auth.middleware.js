const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Obter token do header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).json({ message: 'Autenticação necessária' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};