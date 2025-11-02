import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import { logger } from "../utils/logger.js";

export const getAllPurchases = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const purchases = await Purchase.find().populate("producto").skip(skip).limit(limit);
    const total = await Purchase.countDocuments();
    return { purchases, total };
  } catch (error) {
    logger(error.message);
    throw new Error("Error obteniendo compras");
  }
};

export const getPurchaseById = async (id) => {
  try {
    return await Purchase.findById(id).populate("producto");
  } catch (error) {
    logger(error.message);
    throw new Error("Compra no encontrada");
  }
};

export const createPurchaseService = async (data) => {
  try {
    const product = await Product.findById(data.producto);
    if (!product) throw new Error("Producto no encontrado");

    data.total = product.precio * data.cantidad;
    const purchase = new Purchase(data);
    await purchase.save();
    return purchase;
  } catch (error) {
    logger(error.message);
    throw new Error("Error creando compra");
  }
};

export const updatePurchaseService = async (id, data) => {
  try {
    if (data.producto) {
      const product = await Product.findById(data.producto);
      if (!product) throw new Error("Producto no encontrado");
      data.total = product.precio * data.cantidad;
    }
    return await Purchase.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger(error.message);
    throw new Error("Error actualizando compra");
  }
};

export const deletePurchaseService = async (id) => {
  try {
    await Purchase.findByIdAndDelete(id);
  } catch (error) {
    logger(error.message);
    throw new Error("Error eliminando compra");
  }
};
