import { registerUser, loginUser } from "../services/user.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
