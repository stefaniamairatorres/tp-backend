import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ==========================================================
// 1. MIDDLEWARES Y CORS CORREGIDO
// ==========================================================

// Definición de orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin?.startsWith(o))) {
      return callback(null, true);
    }
    console.log("❌ Bloqueado por CORS:", origin);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ==========================================================
// 2. RUTA RAÍZ (Render health check)
// ==========================================================
app.get("/", (req, res) => {
  res.send("✅ API de TP-BACK-FINAL en funcionamiento. Usa la ruta /api/products para datos.");
});

// ==========================================================
// 3. RUTAS DE LA APLICACIÓN
// ==========================================================
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/uploads", express.static("uploads"));

// Middleware de errores
app.use(errorHandler);

// ==========================================================
// 4. SERVIDOR
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
