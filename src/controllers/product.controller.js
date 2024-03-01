import { productService } from "../services/service.js";

export const getProductController = async (req, res) => {
  try {
    const productos = await productService.getAll();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postProductController = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const producto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    await productService.save(producto);
    res.json("Producto creado con éxito");
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevoProd = req.body;

    await productService.update(id, nuevoProd);

    res.json("Producto actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del producto a eliminar

    // Lógica para eliminar el producto utilizando el servicio de productos
    await productService.delete(id);

    // Respuesta exitosa en formato JSON
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    // Manejo de errores: si hay algún error, devolver un código de estado 500 y un mensaje de error
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
