import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv'; // Importa dotenv para leer la clave de Render

dotenv.config(); // Carga las variables de entorno, incluyendo STRIPE_SECRET_KEY

const router = express.Router();
// 🚨 INICIALIZACIÓN CRÍTICA: Aseguramos que la clave de Render se use aquí
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware para parsear JSON (aunque ya lo tienes en app.js, no está de más)
router.use(express.json());

// Crear Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // El monto debe venir del Frontend

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido. El monto debe ser un número positivo." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe usa centavos
            currency: "usd", // Usamos USD, si necesitas ARS, cámbialo aquí
            automatic_payment_methods: { enabled: true },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            message: "Intención de pago creada con éxito.",
        });
    } catch (error) {
        // Logueamos el error de Stripe para el diagnóstico en Render
        console.error("Error CRÍTICO de Stripe:", error); 
        res.status(500).json({ 
            error: "Hubo un problema al conectar con el servidor de pago. Verifica STRIPE_SECRET_KEY en Render.",
            details: error.message 
        });
    }
});

export default router;