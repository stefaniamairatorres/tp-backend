

import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true // Asegura que no haya dos categorías con el mismo nombre
        },
        slug: {
            type: String,
            // El slug es opcional, pero lo añadimos porque lo insertaste en Compass
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;