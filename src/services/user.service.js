const pool = require('../db');
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
  const query = 'SELECT * FROM auth_service.users WHERE is_active = true';
  const { rows } = await pool.query(query);
  return rows;
};

const getUserById = async (id) => {
  const query = 'SELECT * FROM auth_service.users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) throw new Error('User not found');
  return rows[0];
};

const createUser = async ({ email, password, full_name, phone }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO auth_service.users (email, password_hash, full_name, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [email, hashedPassword, full_name, phone]);
  return rows[0];
};

const updateUser = async (id, updates) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (updates.full_name) {
    fields.push(`full_name = $${paramCount++}`);
    values.push(updates.full_name);
  }
  if (updates.email) {
    fields.push(`email = $${paramCount++}`);
    values.push(updates.email);
  }
  if (updates.phone) {
    fields.push(`phone = $${paramCount++}`);
    values.push(updates.phone);
  }
  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    fields.push(`password_hash = $${paramCount++}`);
    values.push(hashedPassword);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `UPDATE auth_service.users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  const { rows } = await pool.query(query, values);
  if (rows.length === 0) throw new Error('User not found');
  return rows[0];
};

const deleteUser = async (id) => {
  const query = 'DELETE FROM auth_service.users WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) throw new Error('User not found');
  return rows[0];
};

const deactivateUser = async (id) => {
  const query = 'UPDATE auth_service.users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) throw new Error('User not found');
  return rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
};
