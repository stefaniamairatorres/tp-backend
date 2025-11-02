import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// 🟢 Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    // Incluir populate para mostrar la información completa de la categoría
    const products = await Product.find({}).populate('category'); 
    res.json(products);
  } catch (error) {
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