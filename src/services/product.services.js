import productDao from "../daos/product.dao.js";

// Crear una instancia del DAO
const dao = new productDao();

export const obtenerProductos = async () => {
    try {
        // Recuperar los productos con un límite y página predeterminados
        const productos = await dao.recuperarProducto({ limit: 10, page: 1 });
        return productos;
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw error;
    }
}

export const createProducto = async (producto) => {
    try {
        // Validar que el producto tenga todos los campos necesarios
        if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
            throw new Error("Todos los campos del producto son obligatorios.");
        }
        

        // Crear el producto en la base de datos
        await dao.guardarProducto(producto);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        throw error;
    }
}


export const actualizarProducto = async (id, nuevoProducto) => {
    try {
        // Verificar si el producto existe
        const productoExistente = await dao.getProductById(id);
        if (!productoExistente) {
            throw new Error("El producto no existe");
        }

        // Actualizar el producto con los nuevos datos
        const productoActualizado = await dao.updateProduct(id, nuevoProducto);

        return productoActualizado;
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        throw error;
    }
};


// Función para eliminar un producto por su ID
export const eliminarProducto = async (id) => {
    try {
      // Verificar si el ID del producto existe
      const productoExistente = await dao.getProductById(id);
      if (!productoExistente) {
        throw new Error("El producto no existe");
      }
  
      // Llamar al método deleteProduct del DAO y pasarle el ID del producto
      await dao.deleteProduct(id);
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso de eliminación
      console.error("Error al eliminar el producto:", error);
      throw error; // Lanzar el error para que pueda ser manejado en un nivel superior
    }
  };


