import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async ({
  user_name,
  email,
  password,
  first_name,
  last_name
}) => {
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO auth_user."user" 
      (user_name, email, password, first_name, last_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_name, email, first_name, last_name, created_at
  `;
  const values = [user_name, email, hashedPassword, first_name, last_name];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const loginUser = async ({ email, password }) => {
  const query = `SELECT * FROM auth_user."user" WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);

  const user = rows[0];
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // verificar contraseña
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // generar JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      user_name: user.user_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // no devolvemos password
  return {
    user: {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
    },
    token,
  };
};
const router = express.Router();

// GET todos los usuarios
router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.get("/auth_user.user?select=*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { data } = await supabase.post("/auth_user.user", req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar usuario por id
router.put("/:id", async (req, res) => {
  try {
    const { data } = await supabase.patch(`/auth_user.user?id=eq.${req.params.id}`, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE usuario por id
router.delete("/:id", async (req, res) => {
  try {
    await supabase.delete(`/auth_user.user?id=eq.${req.params.id}`);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
