const pool = require('../db');
const bcrypt = require('bcrypt');

// Para tests, usar crypto en lugar de uuid
const { randomUUID } = require('crypto');

const getAllUsers = async () => {
  try {
    const query = `
      SELECT id, email, full_name, phone, is_active, created_at, updated_at
      FROM auth_service.users
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error en getAllUsers:', error.message);
    throw error;
  }
};

const getUserById = async (id) => {
  const query = `
    SELECT id, email, full_name, phone, is_active, created_at, updated_at
    FROM auth_service.users
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  if (!rows[0]) throw new Error('Usuario no encontrado');
  return rows[0];
};

const createUser = async ({ email, password, full_name, phone }) => {
  const id = randomUUID();
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO auth_service.users 
      (id, email, password_hash, full_name, phone, is_active)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id, email, full_name, phone, is_active, created_at, updated_at
  `;
  const values = [id, email, hashedPassword, full_name, phone];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateUser = async (id, { email, full_name, phone, password }) => {
  let query = `
    UPDATE auth_service.users
    SET email = COALESCE($1, email),
        full_name = COALESCE($2, full_name),
        phone = COALESCE($3, phone)
  `;
  let values = [email, full_name, phone];

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    query += `, password_hash = $4`;
    values.push(hashedPassword);
  }

  query += `, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${values.length + 1}
    RETURNING id, email, full_name, phone, is_active, created_at, updated_at
  `;
  values.push(id);

  const { rows } = await pool.query(query, values);
  if (!rows[0]) throw new Error('Usuario no encontrado');
  return rows[0];
};

const deleteUser = async (id) => {
  const query = `DELETE FROM auth_service.users WHERE id = $1 RETURNING id`;
  const { rows } = await pool.query(query, [id]);
  if (!rows[0]) throw new Error('Usuario no encontrado');
  return rows[0];
};

const deactivateUser = async (id) => {
  const query = `
    UPDATE auth_service.users
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, email, full_name, phone, is_active, created_at, updated_at
  `;
  const { rows } = await pool.query(query, [id]);
  if (!rows[0]) throw new Error('Usuario no encontrado');
  return rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser
};
