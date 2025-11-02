import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            required: true,
        },
        // --- LÍNEA AGREGADA: CAMPO DE IMAGEN ---
        image: {
            type: String,
            required: true, // Lo hacemos requerido para la imagen que envías
        },
        // --- LÍNEAS AGREGADAS: REFERENCIA A CATEGORÍA ---
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // 'Category' debe coincidir con el nombre de tu modelo de categoría
            required: true,
        },
        // ----------------------------------------------------
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;