const { validationResult } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
} = require('../services/user.service');

const formatUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.full_name,
  phone: user.phone,
  is_active: user.is_active,
  created_at: user.created_at,
  updated_at: user.updated_at
});

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users.map(formatUser));
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(formatUser(user));
  } catch (error) {
    console.error('Error en getUser:', error);
    res.status(404).json({ error: error.message });
  }
};

const createNewUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password, name, phone } = req.body;
    console.log('Creando usuario:', { email, name, phone });
    
    const user = await createUser({ email, password, full_name: name, phone });
    res.status(201).json(formatUser(user));
  } catch (error) {
    console.error('Error en createNewUser:', error);
    if (error.message.includes('duplicate')) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    res.status(400).json({ error: error.message });
  }
};

const updateExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.name) updates.full_name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.password) updates.password = req.body.password;

    const user = await updateUser(id, updates);
    res.status(200).json(formatUser(user));
  } catch (error) {
    console.error('Error en updateExistingUser:', error);
    res.status(400).json({ error: error.message });
  }
};

const deleteExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error en deleteExistingUser:', error);
    res.status(404).json({ error: error.message });
  }
};

const deactivateExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await deactivateUser(id);
    res.status(200).json(formatUser(user));
  } catch (error) {
    console.error('Error en deactivateExistingUser:', error);
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
  deactivateExistingUser
};
