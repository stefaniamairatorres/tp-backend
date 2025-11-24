import mongoose from 'mongoose';
// Importa otros módulos si los tienes (ej: Schema)

const ProductSchema = new mongoose.Schema({
    // ... otros campos
    
    // CAMBIO CRÍTICO: Debe ser String para aceptar el nombre de la categoría del Frontend
    category: {
        type: String, // <-- ¡CORREGIDO! Antes era ObjectId, lo cual causaba el error BSON
        required: true,
    },
    
    // ... otros campos
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;