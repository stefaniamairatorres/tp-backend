import express from 'express';
// Solo importamos las funciones del controlador, NO la configuración de mercadopago
import { createPaymentPreference, receiveWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// POST: Llama a la función del controlador
router.post('/create-preference', createPaymentPreference); 

// POST: Ruta para Webhooks de Mercado Pago
router.post('/webhook', receiveWebhook);

export default router;
