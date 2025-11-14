import express from 'express';
// Asegúrate de que tu controlador ahora exporte simulatePayment
// Haremos que esta línea importe también 'simulatePayment'
import { createPaymentPreference, receiveWebhook, simulatePayment } from '../controllers/paymentController.js'; 

const router = express.Router();

// POST: Llama a la función del controlador
router.post('/create-preference', createPaymentPreference); 

// POST: Ruta para Webhooks de Mercado Pago
router.post('/webhook', receiveWebhook);

// ==========================================================
// 🚨 RUTA AÑADIDA PARA LA SIMULACIÓN DE PAGO 🚨
// ==========================================================
// POST: Permite al frontend simular una transacción exitosa sin ir a MP.
router.post('/simulate', simulatePayment);

export default router;