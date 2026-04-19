import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";



dotenv.config();

const app = express();

app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true, service: "trace-api-mongo" }));

// Rutas

// Manejo de errores
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        ok: false,
        error: err.message || "Error interno",
    });
});

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => console.log(`API corriendo en http://localhost:${port}`));
    })
    .catch((e) => {
        console.error("No se pudo conectar a MongoDB:", e);
        process.exit(1);
    });