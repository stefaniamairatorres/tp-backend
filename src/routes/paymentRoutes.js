import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware para parsear JSON
router.use(express.json());

// Crear Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // Monto en centavos

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd", // Cambiá a "ars" si querés
            automatic_payment_methods: { enabled: true },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: "Error creando Payment Intent" });
    }
});

export default router;
