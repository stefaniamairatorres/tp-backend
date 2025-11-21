import Product from "../models/productModel.js";
/**
 * Obtener todos los productos
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .lean();

    res.json(products);
  } catch (error) {
    console.error("Error en getProducts:", error.message);
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .lean();

    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    console.error("Error en getProduct:", error.message);
    res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};

/**
 * Crear producto
 */
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error en createProduct:", error.message);
    res.status(400).json({ message: "Error al crear producto", error: error.message });
  }
};

/**
 * Actualizar producto
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("category");

    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    console.error("Error en updateProduct:", error.message);
    res.status(400).json({ message: "Error al actualizar producto", error: error.message });
  }
};

/**
 * Eliminar producto
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteProduct:", error.message);
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate("category")
      .lean();

    res.json(products);
  } catch (error) {
    console.error("Error en getProductsByCategory:", error.message);
    res.status(500).json({ message: "Error al filtrar productos", error: error.message });
  }
};

/**
 * Actualizar imagen del producto
 */
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se envió ninguna imagen" });

    const imagePath = `/uploads/${req.file.filename}`;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { image: imagePath },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({
      message: "Imagen actualizada correctamente",
      product,
    });
  } catch (error) {
    console.error("Error en uploadProductImage:", error.message);
    res.status(500).json({ message: "Error al cargar imagen", error: error.message });
  }
};
