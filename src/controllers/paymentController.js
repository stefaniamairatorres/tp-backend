import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// 🚨 CONFIGURACIÓN CORREGIDA 🚨
// 1. Usa la clase MercadoPagoConfig para inicializar el cliente
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 5000 },
});

// 2. Creamos una instancia de la clase Preference (necesaria para crear el checkout)
const preference = new Preference(client);

/**
 * @desc Crea una preferencia de pago en Mercado Pago
 * @route POST /api/payment/create-preference
 */
const createPaymentPreference = async (req, res) => {
    const { items, userId } = req.body; 

    // 1. Transformar los ítems al formato requerido por Mercado Pago
    const itemsMP = items.map(item => ({
        title: item.name, 
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS', // Ajusta la moneda si es necesario
    }));

    // 2. Crear la estructura de la solicitud
    const body = {
        items: itemsMP,
        external_reference: userId, 
        back_urls: {
            "success": "http://localhost:5173/success", 
            "failure": "http://localhost:5173/failure",
            "pending": "http://localhost:5173/pending",
        },
        auto_return: "approved",
    };

    try {
        // 3. Crear la preferencia usando la instancia 'preference'
        const response = await preference.create({ body });
        
        // 4. Devolver el link de inicio al frontend
        res.status(200).json({ 
            id: response.id, 
            init_point: response.init_point 
        });

    } catch (error) {
        console.error("Error al crear la preferencia de pago:", error);
        res.status(500).json({ error: "No se pudo iniciar el proceso de pago. Revisa tu Access Token." });
    }
};

const receiveWebhook = (req, res) => {
    // La lógica de Webhook irá aquí
    console.log("Notificación de Mercado Pago recibida:", req.query);
    res.status(204).send();
};


export { createPaymentPreference, receiveWebhook };
