// Importaciones necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// URI de respaldo (fallback) por si no está disponible la variable de entorno
const HARDCODED_URI = 'mongodb+srv://stefaniamairatorres_db_user:stefania123456@cluster0.l9nrhim.mongodb.net/tienda?retryWrites=true&w=majority';
const MONGODB_CONNECT_URI = process.env.MONGODB_URI || HARDCODED_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_CONNECT_URI)
  .then(() => console.log('✅ MongoDB conectado.'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err.message));

// =======================================================
// CONFIGURACIÓN DE CORS PARA VERCEL, RENDER Y LOCALHOST
// =======================================================

const allowedOrigins = [
  'https://tp-grupo-b.vercel.app', // Frontend Vercel
  'https://tp-back-final.onrender.com', // Backend Render
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// =======================================================

// Rutas
app.get('/', (req, res) => {
  res.send('Servidor de E-commerce activo.');
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment', paymentRoutes);

app.use('/uploads', express.static('uploads'));

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send("Ruta no encontrada");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});
