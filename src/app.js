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

// 🚨 SOLUCIÓN FORZOSA: Usamos tu URI de MongoDB directamente como respaldo (fallback)
// Si la variable de entorno de Render falla. Esto soluciona el error 'undefined'
// y permite que la aplicación cargue los productos.
// NOTA: Esta URI contiene tu contraseña, por lo que debe eliminarse de aquí una vez que Render cargue la variable de entorno.
const HARDCODED_URI = 'mongodb+srv://stefaniamairatorres_db_user:stefania123456@cluster0.l9nrhim.mongodb.net/tienda?retryWrites=true&w=majority';
const MONGODB_CONNECT_URI = process.env.MONGODB_URI || HARDCODED_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_CONNECT_URI)
    .then(() => console.log('✅ MongoDB conectado forzosamente. El servidor Express puede arrancar.'))
    .catch(err => {
        console.error('❌ Error CRÍTICO de conexión a MongoDB:', err.message);
        // Si hay un error, el servidor al menos intentará arrancar en el puerto 5000
    });


// CONFIGURACIÓN CRÍTICA DE CORS 
const allowedOrigins = [
    'http://localhost:5173', 
    'https://tp-back-final.onrender.com', 
    'https://tp-grupo-b-git-main-stefaniamairatorres-projects.vercel.app', 
];

const corsOptions = {
    origin: (origin, callback) => {
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