const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createNewUser, getUsers, getUser, updateExistingUser, deleteExistingUser, deactivateExistingUser } = require('../controllers/user.controller');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// POST /api/users (crear usuario)
router.post('/',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
  body('name').notEmpty().withMessage('Name requerido'),
  handleValidationErrors,
  createNewUser
);

// POST /api/users/register (alias para crear)
router.post('/register',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
  body('name').notEmpty().withMessage('Name requerido'),
  handleValidationErrors,
  createNewUser
);

// POST /api/users/login (solo retorna error 404 por ahora)
router.post('/login', (req, res) => {
  res.status(404).json({ error: 'Login no implementado en CRUD' });
});

// GET /api/users (con autenticación)
router.get('/', getUsers);

// GET /api/users/:id (con autenticación)
router.get('/:id', getUser);

// PUT /api/users/:id (sin autenticación por ahora)
router.put('/:id', updateExistingUser);

// DELETE /api/users/:id (sin autenticación por ahora)
router.delete('/:id', deleteExistingUser);

// PATCH /api/users/:id/deactivate
router.patch('/:id/deactivate', deactivateExistingUser);

module.exports = router;