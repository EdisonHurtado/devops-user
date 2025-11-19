// src/routes/user.routes.js
import { Router } from "express";
import {
  getUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
  deactivateExistingUser,
} from "../controllers/user.controller.js";

const router = Router();

// GET: lista de usuarios
router.get("/", getUsers);

// GET: obtener usuario por id
router.get("/:id", getUser);

// POST: crear usuario
router.post("/", createNewUser);

// PUT: actualizar usuario por id
router.put("/:id", updateExistingUser);

// DELETE: eliminar usuario por id
router.delete("/:id", deleteExistingUser);

// PATCH: desactivar usuario por id
router.patch("/:id/deactivate", deactivateExistingUser);

export default router;
