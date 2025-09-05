
import dotenv from "dotenv";

import axios from "axios";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const client = axios.create({
  baseURL: `${SUPABASE_URL}`,
  headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  }
});

export default client;

export const insertUser = async (userData) => {
  const { data } = await client.post("/auth_user.users", userData);
  return data;
};

export const getUsers = async () => {
  const { data } = await client.get("/auth_user.userss?select=*");
  return data;
};
