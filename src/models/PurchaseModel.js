import mongoose from 'mongoose';

const PurchasedItemSchema = new mongoose.Schema({
    // Almacenamos la información esencial del producto en el momento de la compra
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false },
});

const PurchaseSchema = new mongoose.Schema({
    userId: {
        type: String, // Usamos String porque viene de Mercado Pago como external_reference
        required: true,
        trim: true,
    },
    items: [PurchasedItemSchema], // Lista de productos comprados
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
        unique: true, // Es importante que el paymentId sea único para evitar duplicados
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'failure', 'registered'], // Estado del pago
        default: 'registered',
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Añade campos createdAt y updatedAt
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

export default Purchase;
