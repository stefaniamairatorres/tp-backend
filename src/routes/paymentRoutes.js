import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------------------------------------------
// Middleware CRÍTICO: Webhook necesita RAW BODY
// ---------------------------------------------------
const rawBodyMiddleware = express.raw({ type: 'application/json' });

// Middleware JSON (para todas menos webhook)
router.use(express.json());

// ---------------------------------------------------
// 🔹 Crear intención de pago
// ---------------------------------------------------
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error("Error Stripe:", error);
        res.status(500).json({ error: "Error al crear pago" });
    }
});

// ---------------------------------------------------
// 🔹 Webhook de Stripe (CONFIRMA LOS PAGOS)
// ---------------------------------------------------
router.post('/webhook', rawBodyMiddleware, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const payment = event.data.object;
            console.log(`💚 Pago exitoso → ID: ${payment.id}`);
            break;

        case 'payment_intent.payment_failed':
            console.log(`❌ Pago fallido`);
            break;

        default:
            console.log(`Evento ignorado: ${event.type}`);
    }

    res.json({ received: true });
});

export default router;
