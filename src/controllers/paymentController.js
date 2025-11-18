import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv'; 

// Carga las variables de entorno de Render
dotenv.config(); 

const router = express.Router();
// INICIALIZACIÓN CRÍTICA: Aseguramos que se lea la clave de Render (sk_test_...)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware para parsear JSON
router.use(express.json());

// Ruta: POST /api/payment/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; 

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido. El monto debe ser un número positivo." });
        }

        // Crear la intención de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe usa centavos, se multiplica por 100
            currency: "usd", // Moneda
            automatic_payment_methods: { enabled: true },
        });

        // Devolver el secreto al Frontend
        res.json({
            clientSecret: paymentIntent.client_secret,
            message: "Intención de pago creada con éxito.",
        });
    } catch (error) {
        // Muestra el error de autenticación de Stripe en el log de Render
        console.error("Error CRÍTICO de Stripe:", error); 
        res.status(500).json({ 
            error: "Hubo un problema al conectar con el servidor de pago. Verifique STRIPE_SECRET_KEY en Render y su validez.",
            details: error.message 
        });
    }
});

export default router;