import { cartsModel } from "../models/carts.model.js";
import { productModel } from "../models/products.model.js";

class CartDao {
  constructor() {
    this.model = cartsModel;
  }

  async getAllCarts() {
    try {
      const carts = await this.model
        .find()
        .populate({
          path: "productos.product",
          select: "-__v",
        })
        .lean();
      return carts;
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.model.findById(id).lean();
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }

  async createCart(cartData) {
    try {
      // Verificar si el ID del producto existe en la base de datos
      const { product, quantity } = cartData;
      const existingProduct = await productModel.findById(product);
      if (!existingProduct) {
        throw new Error("El ID del producto proporcionado no existe.");
      }

      // Crear un nuevo carrito con el producto y la cantidad especificada
      const nuevoCarrito = {
        productos: [{ product: product, quantity: quantity }],
      };
      
      const cart = await this.model.create(nuevoCarrito);
      return cart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async updateCart(id, cartData) {
    try {
      const updatedCart = await this.model.findByIdAndUpdate(id, cartData, { new: true });
      return updatedCart;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error;
    }
  }

  async deleteCart(id) {
    try {
      await this.model.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
      throw error;
    }
  }
}

export default CartDao;
