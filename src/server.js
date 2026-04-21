import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

// importar rutas
import usuariosRoutes from "./routes/usuario.routes.js"
import productosRoutes from "./routes/producto.routes.js"
import ventasRoutes from "./routes/ventas.routes.js"
import { configurarColecciones } from "./models/collection_configure.js"

dotenv.config();

const app = express();

app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true, service: "trace-api-mongo" }));

// configurar rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);

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