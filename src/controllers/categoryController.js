

import Category from "../models/Category.js"; // ¡Única importación correcta!

// 1. FUNCIÓN PARA LISTAR CATEGORÍAS (GET)
export const getCategories = async (req, res) => {
  try {
    // Buscar todas las categorías en la base de datos
    const categories = await Category.find({});
    // Devolver las categorías como JSON
    res.status(200).json(categories);
  } catch (error) {
    // Si ocurre un error, devuelve un estado 500
    res.status(500).json({ message: "Error al obtener categorías.", error: error.message });
  }
};

// 2. FUNCIÓN PARA ACTUALIZAR CATEGORÍAS (PUT/PATCH)
export const updateCategory = async (req, res) => {
  const { id } = req.params; // Captura el ID de la URL (el ID que pegaste)
  const { name } = req.body; // Captura el nuevo nombre (ej., "ELECTRÓNICA")

  try {
    // Usar findByIdAndUpdate para actualizar el documento en MongoDB
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name }, // Solo actualizamos el campo 'name'
      { new: true } // Devuelve el documento ya actualizado
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    res.status(200).json({ 
        message: "Nombre de categoría actualizado con éxito.",
        category: updatedCategory 
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la categoría.", error: error.message });
  }
};