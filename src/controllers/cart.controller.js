import {
  obtenerCarts,
  createCart,
  actualizarCarrito,
  eliminarCarrito,
} from "../services/cart.services.js";

export const getCartController = async (req, res) => {
  try {
    const carts = await obtenerCarts();
    if (!carts || carts.length === 0) {
      return res.status(404).json({ error: "No se encontraron carritos." });
    }

    res.json(carts);
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postCartController = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || !quantity) {
      return res
        .status(400)
        .json({ error: "El ID del producto y la cantidad son obligatorios." });
    }
    await createCart({ product: id, quantity });
    res.status(201).json({ message: "Carrito creado exitosamente." });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, quantity } = req.body;

    // Verificar si se proporciona el ID del producto y la cantidad
    if (!product || !quantity) {
      return res
        .status(400)
        .json({ error: "El ID del producto y la cantidad son obligatorios." });
    }

    // Llamar a la función actualizarCarrito del servicio
    await actualizarCarrito(id, { product, quantity });

    res.json("Carrito actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const { id } = req.params;

    // Llamar a la función eliminarCarrito del servicio
    await eliminarCarrito(id);

    res.json("Carrito eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
