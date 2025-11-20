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

// 🚨 SOLUCIÓN FORZOSA: Usamos tu URI de MongoDB directamente como respaldo (fallback)
// NOTA: Esta URI debe estar en .env o en una herramienta de secretos.
const HARDCODED_URI = 'mongodb+srv://stefaniamairatorres_db_user:stefania123456@cluster0.l9nrhim.mongodb.net/tienda?retryWrites=true&w=majority';
const MONGODB_CONNECT_URI = process.env.MONGODB_URI || HARDCODED_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_CONNECT_URI)
    .then(() => console.log('✅ MongoDB conectado forzosamente. El servidor Express puede arrancar.'))
    .catch(err => {
        console.error('❌ Error CRÍTICO de conexión a MongoDB:', err.message);
    });


// =======================================================
// CONFIGURACIÓN CRÍTICA DE CORS - AJUSTE DE DOMINIOS
// =======================================================

// Definimos la lista de orígenes permitidos.
// Es crucial incluir la URL de Vercel (tp-grupo-b.vercel.app)
// y, para evitar problemas durante el desarrollo/pruebas, también la URL de Render.
const allowedOrigins = [
    'https://tp-grupo-b.vercel.app', // Tu dominio principal de Frontend en Vercel
    'https://tp-back-final.onrender.com', 
    'http://localhost:5173',      // Tu dominio de Backend en Render (a veces necesario)
    // Puedes añadir otros dominios o IPs de prueba si es necesario, como 'http://localhost:3000'
];

const corsOptions = {
    // Utilizamos una función para verificar si el origen de la solicitud está en nuestra lista.
    origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como Postman o CURL) o si el origen está en la lista.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// =======================================================

// Rutas
app.get('/', (req, res) => {
    res.send('Servidor de E-commerce activo.');
});
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/payment', paymentRoutes); 

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send("Ruta no encontrada");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});