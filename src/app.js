// Importaciones necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// ⚠️ CONFIGURACIÓN CRÍTICA DE CORS ⚠️
// Añadir aquí todos los dominios que accederán al backend
const allowedOrigins = [
    'http://localhost:5173', // Para desarrollo local del frontend
    'https://tp-back-final.onrender.com', // El dominio propio (Render)
    'https://tp-grupo-b-git-main-stefaniamairatorres-projects.vercel.app', // URL de Vercel
    // Si tu URL final de Vercel es diferente a la de la rama 'main', agrégala aquí también.
];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como aplicaciones móviles, cURL o navegadores antiguos)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ Bloqueado por CORS: ${origin}`);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB conectado: ' + process.env.MONGODB_URI.substring(21, 58)))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.get('/', (req, res) => {
    res.send('Servidor de E-commerce activo.');
});
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send("Ruta no encontrada");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});