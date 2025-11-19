// Setup global para los tests
jest.setTimeout(30000);

// Mock console para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

const pool = require('../src/db');

jest.mock('../src/db');

let mockUsers = [];
const createdEmails = new Set(); // ← Rastrear emails creados

pool.query.mockImplementation((query, params) => {
  // CREATE USER
  if (query.includes('INSERT INTO') && query.includes('users')) {
    const email = params[0];
    
    // Validar email duplicado
    if (createdEmails.has(email)) {
      return Promise.reject(new Error('duplicate key value'));
    }

    const id = require('crypto').randomUUID();
    const user = {
      id,
      email,
      password_hash: params[1],
      full_name: params[2],
      phone: params[3] || null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    createdEmails.add(email);
    mockUsers.push(user);
    return Promise.resolve({ rows: [user] });
  }

  // GET ALL USERS (filtrando is_active = true)
  if (query.includes('SELECT') && query.includes('WHERE is_active = true')) {
    const activeUsers = mockUsers.filter(u => u.is_active === true);
    return Promise.resolve({ rows: activeUsers });
  }

  // GET ALL USERS (sin filtro)
  if (query.includes('SELECT') && query.includes('FROM auth_service.users') && !query.includes('WHERE')) {
    return Promise.resolve({ rows: mockUsers });
  }

  // GET USER BY ID
  if (query.includes('SELECT') && query.includes('WHERE id')) {
    const user = mockUsers.find(u => u.id === params[0]);
    if (!user) return Promise.reject(new Error('User not found'));
    return Promise.resolve({ rows: [user] });
  }

  // UPDATE USER
  if (query.includes('UPDATE auth_service.users')) {
    const userId = params[params.length - 1];
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return Promise.reject(new Error('User not found'));
    
    if (params[0]) user.full_name = params[0];
    if (params[1]) user.email = params[1];
    if (params[2]) user.phone = params[2];
    user.updated_at = new Date();
    
    return Promise.resolve({ rows: [user] });
  }

  // DELETE USER
  if (query.includes('DELETE FROM auth_service.users')) {
    const userId = params[0];
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) return Promise.reject(new Error('User not found'));
    
    const [deleted] = mockUsers.splice(index, 1);
    return Promise.resolve({ rows: [deleted] });
  }

  // DEACTIVATE USER
  if (query.includes('UPDATE') && query.includes('is_active = false')) {
    const userId = params[0];
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return Promise.reject(new Error('User not found'));
    
    user.is_active = false;
    user.updated_at = new Date();
    return Promise.resolve({ rows: [user] });
  }

  return Promise.resolve({ rows: [] });
});

// Limpiar mock antes de cada test
beforeEach(() => {
  mockUsers = [];
  createdEmails.clear();
  jest.clearAllMocks();
});