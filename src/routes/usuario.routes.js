import { Router } from "express";
import { getDB } from '../db.js';
import { ObjectId } from "mongodb";


const router = Router();

/**
 * POST /api/usuarios
 * Crear usuario
 */
router.post("/", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    // Datos del usuario
    const { nombre, email, rol} = req.body;

    // creacion del documento
    const doc = {
      nombre,
      email,
      rol,
      fechaRegistro: new Date(),
    };

    // guardar los datos
    const result = await db.collection("usuarios").insertOne(doc);

    // respuesta
    res.status(201).json({ ok: true, id: result.insertedId });
  } catch (err) {
    if (err?.code === 11000) {
      ((err.status = 409), (err.message = "El email ya esta registrado"));
    }
  }
});

/**
 * GET /api/usuarios
 * obtener los usuarios registrados
 */
router.get("/", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    // coleccion Usuarios
    // que nos traiga todos los datos exepto la contraseña
    const result = await db
      .collection("usuarios")
      .find({}, { $project: { contraseña: 0 } })
      .limit(50)
      .toArray();

    res.status(200).json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/usuarios/:id
 * obtener un usuario en especifico
 */
router.get("/:id", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    // coleccion Usuarios
    // que nos traiga todos los datos exepto la contraseña
    const usuario = await db
      .collection("usuarios").findOne({ _id: toObject(req.params.id) }, { $project: { contraseña: 0 } });

    if (!usuario){
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    
    }

    res.status(200).json({ ok: true, data: usuario });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/usuarios/:id
 * modificar un usuario en especifico
 */
router.put("/:id", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    const result = await db
      .collection("usuarios")
      .updateOne({ _id: toObject(req.params.id) }, { $set: req.body });

    res.status(200).json({ ok: true, modified: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error al modificar los datos" });
  }
});

/**
 * DELETE /api/usuarios/:id
 * eliminar un usuarios en especifico
 */
router.delete("/:id", async (req, res, next) => {
  try {
    // obtener DB
    const db = await getDB();

    const result = await db
      .collection("usuarios")
      .deleteOne({ _id: toObject(req.params.id) });

    res.status(200).json({ ok: true, result: result.deletedCount });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Error al eliminar los datos" });
  }
});

export default router;
