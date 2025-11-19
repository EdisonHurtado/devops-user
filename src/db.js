import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }
});

pool.on("error", (err) => {
  console.error("❌ Error en pool:", err.message);
});

pool.on("connect", () => {
  console.log("✅ Conexión establecida a la base de datos");
});

// Interceptar queries para loguearlas
const originalQuery = pool.query.bind(pool);
pool.query = function(text, values, callback) {
  const start = Date.now();
  const params = values ? ` [${values.join(", ")}]` : "";
  
  console.log(`\n📝 SQL Query: ${text}${params}`);
  
  if (typeof callback === "function") {
    return originalQuery(text, values, (err, result) => {
      const duration = Date.now() - start;
      if (err) {
        console.log(`❌ Error: ${err.message} (${duration}ms)`);
      } else {
        console.log(`✅ Resultado: ${result.rowCount} filas (${duration}ms)`);
      }
      callback(err, result);
    });
  } else {
    const promise = originalQuery(text, values);
    return promise
      .then((result) => {
        const duration = Date.now() - start;
        console.log(`✅ Resultado: ${result.rowCount} filas (${duration}ms)`);
        return result;
      })
      .catch((err) => {
        const duration = Date.now() - start;
        console.log(`❌ Error: ${err.message} (${duration}ms)`);
        throw err;
      });
  }
};

export default pool;