import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Obtener la URL del frontend desplegado de las variables de entorno
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; 

// Configuración del cliente Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 5000 },
});

// Instancia de Preference para crear checkout
const preference = new Preference(client);

/**
 * @desc Crea una preferencia de pago en Mercado Pago
 * @route POST /api/payment/create-preference
 */
const createPaymentPreference = async (req, res) => {
    const { items, userId } = req.body; 

    // Transformar los ítems al formato requerido por Mercado Pago
    const itemsMP = items.map(item => ({
        title: item.name, 
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS',
    }));

    // Estructura de la solicitud
    const body = {
        items: itemsMP,
        external_reference: userId,
        back_urls: {
            success: `${FRONTEND_URL}/success`, 
            failure: `${FRONTEND_URL}/failure`,
            pending: `${FRONTEND_URL}/pending`,
        },
        auto_return: "approved",
    };

    try {
        const response = await preference.create({ body });
        res.status(200).json({ 
            id: response.id, 
            init_point: response.init_point 
        });
    } catch (error) {
        console.error("Error al crear la preferencia de pago:", error);
        res.status(500).json({ error: "No se pudo iniciar el proceso de pago. Revisa tu Access Token." });
    }
};

/**
 * @desc Recibe notificaciones de Mercado Pago (Webhook)
 * @route POST /api/payment/webhook
 */
const receiveWebhook = (req, res) => {
    console.log("Notificación de Mercado Pago recibida:", req.query);
    res.status(204).send();
};

/**
 * @desc Función de prueba para simular un pago
 * @route POST /api/payment/simulate
 */
const simulatePayment = async (req, res) => {
    res.status(200).json({ message: "Pago simulado con éxito" });
};

// Exportación correcta
export { createPaymentPreference, receiveWebhook, simulatePayment };
