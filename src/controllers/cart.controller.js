import { cartService } from "../services/service.js";
import { productService } from "../services/service.js";


export const getCartController = async (req, res) => {
  try {
    const carts = await cartService.getAll();
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

    // Buscar el producto por su ID
    const product = await productService.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Extraer los campos específicos del producto que deseas incluir en el carrito
    const productData = {
      _id: product._id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    };

    // Crear el objeto de carrito con los datos del producto y la cantidad
    const nuevoCarrito = {
      products: [{ 
        product: productData, 
        quantity: quantity 
      }],
    };
    

    // Guardar el carrito con el producto y la cantidad
    await cartService.save(nuevoCarrito);

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
    if (!product || !quantity) {
      return res
        .status(400)
        .json({ error: "El ID del producto y la cantidad son obligatorios." });
    }
    await cartService.update(id, { product, quantity });
    res.json("Carrito actualizado con éxito");
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.delete(id);
    res.json("Carrito eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
