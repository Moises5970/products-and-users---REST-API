import { Router } from "express";
import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

const router = Router();

const toObject = (id) => new ObjectId(id);

/**
 * POST /api/ventas
 * Registrar una venta
 */
router.post("/", async (req, res, next) => {
  try {
    const db = await getDB();

    const { productoId, cantidad } = req.body;

    // 1. Validaciones básicas
    if (!productoId || !cantidad) {
      return res.status(400).json({
        ok: false,
        error: "productoId y cantidad son requeridos",
      });
    }

    // 2. Buscar producto
    const producto = await db
      .collection("productos")
      .findOne({ _id: toObject(productoId) });

    if (!producto) {
      return res.status(404).json({
        ok: false,
        error: "Producto no encontrado",
      });
    }

    // 3. Validar stock
    if (producto.stock < cantidad) {
      return res.status(400).json({
        ok: false,
        error: "Stock insuficiente",
      });
    }

    // 4. Calcular total
    const total = producto.precio * cantidad;

    // 5. Crear venta
    const venta = {
      productoId: producto._id,
      cantidad,
      total,
      fecha: new Date(),
    };

    const result = await db.collection("ventas").insertOne(venta);

    // 6. Actualizar stock
    await db.collection("productos").updateOne(
      { _id: producto._id },
      { $inc: { stock: -cantidad } }
    );

    res.status(201).json({
      ok: true,
      id: result.insertedId,
      total,
    });

  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ventas
 * Obtener ventas
 */
router.get("/", async (req, res, next) => {
  try {
    const db = await getDB();

    const result = await db.collection("ventas")
      .find({})
      .limit(50)
      .toArray();

    res.status(200).json({ ok: true, data: result });

  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/ventas/:id
 * Eliminar una venta
*/
router.delete("/:id", async (req, res, next) => {
  try {
    const db = await getDB();
    
    const venta = await db.collection("ventas")
    .findOne({ _id: toObject(req.params.id) });
    
    if (!venta) {
        return res.status(404).json({
        ok: false,
        error: "Venta no encontrada"
      });
    }

    // devolver stock
    await db.collection("productos").updateOne(
      { _id: venta.productoId },
      { $inc: { stock: venta.cantidad } }
    );

    const result = await db.collection("ventas")
      .deleteOne({ _id: venta._id });

    res.status(200).json({
      ok: true,
      deleted: result.deletedCount
    });

} catch (err) {
    next(err);
  }
});

//============================== Consultas avanzadas con agregaciones ===========================================

/**
 * GET /api/ventas/stats/productos
 * Total de ventas por producto (AGGREGATION)
 */
router.get("/stats/productos", async (req, res, next) => {
  try {
    const db = await getDB();

    const result = await db.collection("ventas").aggregate([

      // 1. Filtrar ventas válidas
      {
        $match: {
          total: { $gt: 0 }
        }
      },

      // 2. Agrupar por producto
      {
        $group: {
          _id: "$productoId",
          totalVentas: { $sum: "$total" },
          cantidadVendida: { $sum: "$cantidad" }
        }
      },

      // 3. Relacionar con productos
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto"
        }
      },

      { $unwind: "$producto" },

      // 4. Formatear salida
      {
        $project: {
          producto: "$producto.nombre",
          totalVentas: 1,
          cantidadVendida: 1,
          _id: 0
        }
      }

    ]).toArray();

    res.status(200).json({ ok: true, data: result });

  } catch (err) {
    next(err);
  }
});

export default router;