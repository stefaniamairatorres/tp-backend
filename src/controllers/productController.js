import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ... (código existente del productController.js)

// 🟢 Obtener Productos por ID de Categoría (FUNCIÓN FALTANTE)
export const getProductsByCategory = async (req, res) => {
    // 1. Obtener el ID de la categoría de los parámetros de la URL
    const { categoryId } = req.params; 

    try {
        // 2. Ejecutar la consulta en la colección 'Product'
        // Buscamos productos donde el campo 'category' (en el modelo Producto)
        // coincida con el categoryId recibido.
        const products = await Product.find({ category: categoryId })
            // Opcional: Si quieres que muestre el nombre completo de la categoría en el resultado
            .populate('category') 
            .lean(); 
        
        if (!products || products.length === 0) {
            // Manejar caso donde no hay productos o el ID es inválido
            return res.status(404).json({ message: "No se encontraron productos para la categoría especificada." });
        }

        // 3. Devolver los productos encontrados
        res.status(200).json(products);

    } catch (error) {
        console.error("Error en getProductsByCategory:", error);
        // Manejo de errores (ej. ID malformado)
        if (error.name === 'CastError') {
             return res.status(404).json({ message: "ID de categoría inválido." });
        }
        res.status(500).json({ 
            message: "Error al obtener productos por categoría.", 
            error: error.message 
        });
    }
};

// ... (resto del código existente del productController.js)

// 🟢 Crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el producto", error: error.message });
  }
};

// 🟢 Obtener todos los productos (VERSIÓN CORREGIDA SIN POPULATE)
export const getProducts = async (req, res) => {
  try {
    // Se elimina .populate('category') para evitar el error 500 que tumba el servidor en Render.
    // El fallo era la referencia a la categoría al cargar los productos.
    const products = await Product.find({}); 
    res.json(products);
  } catch (error) {
    // Dejamos el manejo de error 500 para diagnosticar si falla por otra razón
    console.error("Error CRÍTICO en getProducts:", error.message);
    res.status(500).json({ message: "Error al obtener los productos", error: error.message });
  }
};

// 🟢 Obtener un producto por ID
export const getProduct = async (req, res) => {
  try {
    // Incluir populate para mostrar la información completa de la categoría
    const product = await Product.findById(req.params.id).populate('category'); 
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    // Manejo de CastError para que no devuelva 500 si el ID es inválido
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "ID de producto inválido o no encontrado." });
    }
    res.status(500).json({ message: "Error al obtener el producto", error: error.message });
  }
};

// 🟢 Actualizar producto (CORREGIDO Y OPTIMIZADO)
export const updateProduct = async (req, res) => {
  try {
    // findByIdAndUpdate toma el ID, el cuerpo de la petición (req.body) 
    // que incluye name, price, image, y category, y lo actualiza en un solo paso.
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true } // 'new: true' devuelve el documento actualizado
    ).populate('category'); // También populamos para ver el resultado completo

    if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    // Manejo explícito del CastError (ID con formato incorrecto)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "ID de producto inválido o no encontrado.", error: error.message });
    }
    
    // Manejo de otros errores del servidor
    res.status(500).json({ message: "Error al actualizar el producto", error: error.message });
  }
};

// 🟢 Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    // Manejo de CastError
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "ID de producto inválido o no encontrado." });
    }
    res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
  }
};

// 🟢 Subir imagen del producto
export const uploadProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    // Guardar nueva imagen
    const imagePath = `/uploads/${req.file.filename}`;
    product.image = imagePath;

    await product.save();
    res.json({ message: "Imagen subida correctamente", image: imagePath });
  } catch (error) {
    // Manejo de CastError
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "ID de producto inválido o no encontrado." });
    }
    res.status(500).json({ message: "Error al subir la imagen", error: error.message });
  }
};