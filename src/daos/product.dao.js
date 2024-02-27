import { productModel } from "../models/products.model.js"

class productDao {
  constructor() {
    this.model = productModel;
  }

  async recuperarProducto(options) {
    const { limit, page, category, availability, sort, query } = options;

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (availability !== undefined) {
      filter.availability = availability;
    }
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    try {
      const result = await this.model
        .find(filter)
        .sort({ price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const totalItems = await this.model.countDocuments(filter);

      return {
        items: result,
        totalItems,
      };
    } catch (error) {
      console.error("Error en getAllProducts:", error);
      throw error;
    }
  }

  async getProductById(id) {
    return await this.model.findById(id);
  }

  async guardarProducto(product) {
    return await this.model.create(product);
  }

  async updateProduct(id, product) {
    return await this.model.findByIdAndUpdate(id, product);
  }

  async deleteProduct(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default productDao;