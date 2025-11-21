import Category from "../../models/Category.js";

// 1. FUNCIÓN PARA LISTAR CATEGORÍAS (GET)
export const getCategories = async (req, res) => {
  try {
    // Buscar todas las categorías en la base de datos
    // Utilizamos .lean() para devolver objetos JavaScript planos, que es más rápido
    const categories = await Category.find({}).lean(); 
    // Devolver las categorías como JSON
    res.status(200).json(categories);
  } catch (error) {
    // Si ocurre un error, devuelve un estado 500
    console.error("Error en getCategories:", error);
    res.status(500).json({ message: "Error al obtener categorías. Verifique si el modelo y la conexión son correctos.", error: error.message });
  }
};

// 2. FUNCIÓN PARA ACTUALIZAR CATEGORÍAS (PUT/PATCH)
export const updateCategory = async (req, res) => {
  const { id } = req.params; 
  const { name } = req.body; 

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name }, 
      { new: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    res.status(200).json({ 
        message: "Nombre de categoría actualizado con éxito.",
        category: updatedCategory 
    });
  } catch (error) {
    console.error("Error en updateCategory:", error);
    res.status(500).json({ message: "Error al actualizar la categoría.", error: error.message });
  }
};