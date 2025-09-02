// src/routes/user.routes.js
import { Router } from "express";
import supabase from "../supabaseClient.js";

const router = Router();

// GET: lista de usuarios
router.get("/", async (req, res) => {
  try {
    const { data } = await supabase.get("/auth_user.user?select=*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: crear usuario
router.post("/", async (req, res) => {
  try {
    const { data } = await supabase.post("/auth_user.user", req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar usuario por id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await supabase.patch(`/auth_user.user?id=eq.${id}`, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: eliminar usuario por id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await supabase.delete(`/auth_user.user?id=eq.${id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
