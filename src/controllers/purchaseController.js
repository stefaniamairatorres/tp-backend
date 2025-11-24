import Purchase from '../models/purchaseModel.js';

/**
 * @desc Registra una nueva compra en la base de datos después de un pago exitoso
 * @route POST /api/purchases
 */
const createPurchase = async (req, res) => {
    try {
        const { userId, paymentId, status, items, totalAmount } = req.body;

        // 1. Validar que la compra no haya sido registrada antes (uniqueness check)
        const existingPurchase = await Purchase.findOne({ paymentId });
        if (existingPurchase) {
            // 409: Conflicto. Ya existe.
            return res.status(409).json({ 
                message: 'Esta compra (paymentId) ya ha sido registrada.', 
                purchase: existingPurchase 
            });
        }

        // 2. Crear y guardar el nuevo documento de compra
        const newPurchase = new Purchase({
            userId,
            paymentId,
            status: status || 'approved', 
            items,
            totalAmount,
        });

        const savedPurchase = await newPurchase.save();

        res.status(201).json({ 
            message: 'Compra registrada con éxito.', 
            purchase: savedPurchase 
        });

    } catch (error) {
        console.error("Error al registrar la compra:", error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la compra.', details: error.message });
    }
};

/**
 * @desc Lista el historial de compras de un usuario específico
 * @route GET /api/purchases/user/:userId
 */
const getPurchasesByUserId = async (req, res) => {
    const { userId } = req.params; 
    try {
        const purchases = await Purchase.find({ userId }).sort({ purchaseDate: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- FUNCIONES AÑADIDAS PARA COMPATIBILIDAD CON purchaseRoutes.js ---

const getPurchases = (req, res) => {
    // Lógica pendiente: Listar todas las compras (Admin)
    res.status(501).json({ message: "Endpoint getPurchases no implementado aún." });
};

const getPurchase = (req, res) => {
    // Lógica pendiente: Obtener una compra por ID
    res.status(501).json({ message: "Endpoint getPurchase no implementado aún." });
};

const updatePurchase = (req, res) => {
    // Lógica pendiente: Actualizar una compra
    res.status(501).json({ message: "Endpoint updatePurchase no implementado aún." });
};

const deletePurchase = (req, res) => {
    // Lógica pendiente: Eliminar una compra
    res.status(501).json({ message: "Endpoint deletePurchase no implementado aún." });
};

export { 
    createPurchase, 
    getPurchasesByUserId, 
    getPurchases, 
    getPurchase, 
    updatePurchase, 
    deletePurchase 
};
