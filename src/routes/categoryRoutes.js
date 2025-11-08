

import express from "express";
// Asegúrar de que tenga un controlador con estas funciones
import { getCategories, updateCategory } from "../controllers/categoryController.js"; 

const router = express.Router();

// Ruta para LISTAR todas las categorías
router.get("/", getCategories); 

// Ruta para ACTUALIZAR una categoría por ID
router.put("/:id", updateCategory); 

export default router;