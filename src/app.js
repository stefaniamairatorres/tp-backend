// Importaciones necesarias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
// 🚨 LÍNEA CLAVE COMENTADA: Deshabilita la inicialización de Stripe para ARRANCAR EL SERVIDOR
// import paymentRoutes from './routes/paymentRoutes.js'; 

dotenv.config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// 🚨 SOLUCIÓN FORZOSA: Usamos tu URI de MongoDB directamente como respaldo (fallback)
// Esto asegura que la conexión a la base de datos funcione.
const HARDCODED_URI = 'mongodb+srv://stefaniamairatorres_db_user:stefania123456@cluster0.l9nrhim.mongodb.net/tienda?retryWrites=true&w=majority';
// Comentario de prueba para forzar el commit
const MONGODB_CONNECT_URI = process.env.MONGODB_URI || HARDCODED_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_CONNECT_URI)
    .then(() => console.log('✅ MongoDB conectado forzosamente. El servidor Express puede arrancar.'))
    .catch(err => {
        console.error('❌ Error CRÍTICO de conexión a MongoDB:', err.message);
    });


// CONFIGURACIÓN CRÍTICA DE CORS - ACEPTA TODOS LOS ORÍGENES (FIX DEFINITIVO)
const corsOptions = {
    // Usamos '*' para asegurar que Vercel se pueda conectar sin problemas de lista blanca.
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Rutas
app.get('/', (req, res) => {
    res.send('Servidor de E-commerce activo.');
});
app.use('/api/products', productRoutes);
// 🚨 LÍNEA CLAVE COMENTADA: Deshabilita la ruta de pago para evitar el error de Stripe.
// app.use('/api/payment', paymentRoutes); 

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send("Ruta no encontrada");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});