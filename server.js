import express from "express";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.routes.js";
import { specs, swaggerUi } from "./src/swagger.js";

dotenv.config();
const app = express();

app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
