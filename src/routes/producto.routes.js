import { Router } from "express";
import { getDB } from '../db.js';

const router = Router();

/**
 * POST /api/productos
 * registrar un producto
 */
router.post("/", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    // Datos del productos
    const { nombre, precio, stock, categoria, creadoPor, fechaCreacion } = req.body;

    // creacion del documento
    const doc = {
      nombre,
      precio,
      stock,
      categoria,
      creadoPor,
      fechaCreacion: new Date(),
    };

    // guardar los datos
    const result = await db.collection("productos").insertOne(doc);

    // respuesta
    res.status(201).json({ ok: true, id: result.insertedId });
  } catch (err) {
    if (err?.code === 11000) {
      ((err.status = 409), (err.message = "El email ya esta registrado"));
    }
  }
});

/**
 * GET /api/productos
 * obtener los productos registrados
 */
router.get("/", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    // coleccion productos
    // que nos traiga todos los datos exepto si esta activo
    const result = await db
      .collection("productos")
      .find({}, { $project: { activo: 0 } })
      .limit(50)
      .toArray();

    res.status(200).json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/productos/:id
 * obtener un producto en especifico
 */
router.get("/:id", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    // coleccion productos
    // que nos traiga todos los datos exepto si esta activo
    const producto = await db
      .collection("productos")
      .findOne({ _id: toObject(req.params.id) }, { $project: { activo: 0 } });

    if (!producto) {
      return res
        .status(404)
        .json({ ok: false, error: "Producto no encontrado" });
    }

    res.status(200).json({ ok: true, data: producto });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/productos/:id
 * modificar un producto en especifico
 */
router.put("/:id", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    const result = await db
      .collection("productos")
      .updateOne({ _id: toObject(req.params.id) }, { $set: req.body });

    res.status(200).json({ ok: true, modified: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error al modificar los datos" });
  }
});

/**
 * DELETE /api/productos/:id
 * eliminar un producto en especifico
 */
router.delete("/:id", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    const result = await db
      .collection("productos")
      .deleteOne({ _id: toObject(req.params.id) });

    res.status(200).json({ ok: true, result: result.deletedCount });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error al eliminar los datos" });
  }
});

export default router;
