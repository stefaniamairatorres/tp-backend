import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser'; //  NECESARIO PARA EL JWT
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // Importa la nueva ruta

dotenv.config();
connectDB();

const app = express();

// ...
// Middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,               // <--- Crucial para el manejo de cookies (JWT)
    })
);
app.use(express.json()); 
// ...
app.use(express.json()); // Permite aceptar datos JSON
app.use(express.urlencoded({ extended: true })); // Permite aceptar datos de formulario
app.use(cookieParser()); // NECESARIO para leer/escribir cookies (JWT)
app.use(morgan("dev"));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);   // Para iniciar el proceso de pago


//  app.use("/api/categories", categoryRoutes);
app.use("/uploads", express.static("uploads"));


// Middleware de Errores (DEBE IR DESPUÉS DE TODAS LAS RUTAS)
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));