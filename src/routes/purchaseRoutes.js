
import express from "express";
import { getPurchases, getPurchase, createPurchase, updatePurchase, deletePurchase } from "../controllers/purchaseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas CRUD para compras
router.route("/")
    .get(getPurchases)           // Listar todas con paginación
    .post(protect, createPurchase); // Crear compra (protegida)

router.route("/:id")
    .get(getPurchase)            // Listar una compra
    .put(protect, updatePurchase) // Actualizar compra (protegida)
    .delete(protect, deletePurchase); // Eliminar compra (protegida)

export default router;
