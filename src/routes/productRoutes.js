// src/routes/productRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Corrección para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Configuración de Multer con rutas absolutas
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"), // carpeta uploads en la raíz del proyecto
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Ruta para subir o cambiar imagen del producto

router.get("/category/:categoryId", getProductsByCategory);

// ✅ Rutas CRUD
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
