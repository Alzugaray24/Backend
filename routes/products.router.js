import { Router } from "express";
import productDao from "../daos/product.dao.js";
import { upload } from "../dirname.js";
import { passportCall, authorization } from "../dirname.js";
import __dirname from "../dirname.js";
import path from 'path'

const router = Router();
const productsDao = new productDao();

router.get("/", passportCall("jwt"), authorization("user"), async (req, res)=> {
  try {
    const { limit, page, sort, query } = req.query;

    const options = {
      limit: parseInt(limit) || 5,
      page: parseInt(page) || 1,
      sort: sort || "asc",
      query: query || "",
    };

    const result = await productsDao.getAllProducts(options);

    const totalPages = Math.ceil(result.totalItems / options.limit);
    const hasPrevPage = options.page > 1;
    const hasNextPage = options.page < totalPages;
    const prevLink = hasPrevPage
      ? `/api/products?limit=${options.limit}&page=${options.page - 1}&sort=${
          options.sort
        }&query=${options.query}`
      : null;
    const nextLink = hasNextPage
      ? `/api/products?limit=${options.limit}&page=${options.page + 1}&sort=${
          options.sort
        }&query=${options.query}`
      : null;

    const response = {
      status: "success",
      payload: result.items,
      totalPages,
      prevPage: options.page - 1,
      nextPage: options.page + 1,
      page: options.page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    res.render("products/mostrarProductos", { response, user: req.user });
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.post("/", upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, price, code, stock } = req.body;

    // Validar que todos los campos excepto thumbnail estén presentes
    if (!title || !description || !price || !code || !stock) {
      return res
        .status(400)
        .json({
          status: "error",
          msg: "Todos los campos son obligatorios, excepto la imagen",
        });
    }

    const thumbnail = path.join(
      __dirname,
      "..",
      "public",
      "img",
      req.file.filename
    );

    const existeCode = await productsDao.model.findOne({ code });

    if (existeCode) {
      console.log("El producto ya existe");
      return res
        .status(409)
        .json({ status: "error", msg: "El producto ya existe" });
    }

    const newProd = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const productoCreado = await productsDao.createProduct(newProd);

    res
      .status(201)
      .send({
        status: "success",
        msg: `el producto con id ${productoCreado._id} fue creado con exito`,
      });
  } catch (error) {
    console.log("Hubo un error al crear el producto", error);
    res
      .status(500)
      .json({ status: "error", msg: "Hubo un error al crear el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const prodExiste = await productsDao.getProductById(pid);

    if (!prodExiste) {
      return res
        .status(404)
        .send({
          status: "error",
          error: "El producto ha actualizar no existe",
        });
    }

    const { title, description, price, thumbnail, code, stock } = req.body;

    const updatedProd = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    await productsDao.updateProduct(pid, updatedProd);

    res
      .status(200)
      .send({
        status: "success",
        msg: `El producto con el id ${pid} fue actualizado`,
      });
  } catch (error) {
    console.log("No se ha podido actualizar el producto", error);
    res
      .status(500)
      .json({ status: "error", msg: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const eliminarProd = await productsDao.deleteProduct(pid);

    if (!eliminarProd) {
      console.log("El producto a eliminar no existe");
      return res
        .status(404)
        .send({ status: "error", error: "El producto a eliminar no existe" });
    }

    res
      .status(200)
      .send({
        status: "success",
        msg: `El producto con id ${pid} fue eliminado`,
      });
  } catch (error) {
    console.log("Error al eliminar el producto:", error);
    res
      .status(500)
      .json({ status: "error", msg: "Error al eliminar el producto" });
  }
});

export default router;
