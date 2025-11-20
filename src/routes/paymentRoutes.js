import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv'; 

dotenv.config(); 

const router = express.Router();

// Inicialización de Stripe con la clave secreta
// NOTA: Esta clave es la sk_test_... (Secret Key)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------------------------------------------------------
// 🚨 Middleware CRÍTICO para el Webhook:
// Stripe envía el body como texto sin procesar (RAW). Este middleware
// se asegura de que la ruta /webhook pueda leer el cuerpo de forma correcta 
// ANTES de que Express intente parsearlo como JSON.
// ----------------------------------------------------------------------
const rawBodyMiddleware = express.raw({ type: 'application/json' });

// Middleware para parsear JSON (Solo se aplica a rutas que NO son el Webhook)
router.use(express.json());

// ----------------------------------------------------------------------
// RUTA 1: CREAR INTENCIÓN DE PAGO
// ----------------------------------------------------------------------
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; 

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido. El monto debe ser un número positivo." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe usa centavos
            currency: "usd", // Moneda
            automatic_payment_methods: { enabled: true },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            message: "Intención de pago creada con éxito.",
        });
    } catch (error) {
        console.error("Error CRÍTICO de Stripe:", error); 
        res.status(500).json({ 
            error: "Hubo un problema al conectar con el servidor de pago. Verifique STRIPE_SECRET_KEY.",
            details: error.message 
        });
    }
});

// ----------------------------------------------------------------------
// RUTA 2: WEBHOOK HANDLER (LA SOLUCIÓN AL PROBLEMA DE CONFIRMACIÓN)
// ----------------------------------------------------------------------
router.post('/webhook', rawBodyMiddleware, async (req, res) => {
    // 1. Obtener la firma y el cuerpo (body) sin procesar
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // 🚨 Clave whsec_... de Render

    let event;

    try {
        // 2. Construir el evento de Stripe de forma segura (verifica la firma)
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        // 3. Si falla la verificación, rechaza la solicitud (seguridad)
        console.error(`❌ Webhook Error: Firma o payload inválido.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 4. Manejar el evento que seleccionaste en el panel de Stripe
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // 🚨 LÓGICA CRÍTICA: Aquí actualizas tu DB.
            // Ejemplo: Marcar el pedido como 'pagado' o enviar el email de confirmación
            console.log(`✅ Pago exitoso para el PaymentIntent: ${paymentIntent.id}. Actualizando base de datos...`);
            break;
        case 'payment_intent.payment_failed':
            // Lógica para marcar el pedido como fallido
            console.log(`❌ Pago fallido para el PaymentIntent: ${event.data.object.id}. Notificando al usuario...`);
            break;
        default:
            // Ignora cualquier otro evento que no seleccionaste en Stripe.
            console.log(`Evento no manejado: ${event.type}`);
    }

    // 5. Responder a Stripe con un 200 OK para confirmar la recepción
    res.json({ received: true });
});


export default router;