const express = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/contratacao.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Todas as rotas requerem autenticação
// router.use(authenticateToken);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;