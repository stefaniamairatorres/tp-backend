import Product from "../models/Product.js";
import { logger } from "../utils/logger.js";

export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();
    return { products, total };
  } catch (error) {
    logger(error.message);
    throw new Error("Error obteniendo productos");
  }
};

export const getProductById = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    logger(error.message);
    throw new Error("Producto no encontrado");
  }
};

export const createProductService = async (data) => {
  try {
    const product = new Product(data);
    await product.save();
    return product;
  } catch (error) {
    logger(error.message);
    throw new Error("Error creando producto");
  }
};

export const updateProductService = async (id, data) => {
  try {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger(error.message);
    throw new Error("Error actualizando producto");
  }
};

export const deleteProductService = async (id) => {
  try {
    await Product.findByIdAndDelete(id);
  } catch (error) {
    logger(error.message);
    throw new Error("Error eliminando producto");
  }
};
