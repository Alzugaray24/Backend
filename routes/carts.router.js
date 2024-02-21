import Router from "express";
import { productModel } from "../models/products.model.js";
import { cartsModel } from "../models/carts.model.js";
import { passportCall, authorization } from "../dirname.js";

const router = Router();

// Obtener carritos
router.get("/", async (req, res) => {
  try {
    const carritosEncontrados = await cartsModel
      .find()
      .populate({
        path: "productos.product", // Indica la ruta para hacer la población del campo 'product' dentro de 'productos'
        select: "-__v", // Excluye el campo '__v' del producto
      })
      .lean(); // Convierte el resultado a objetos JavaScript puros

    if (carritosEncontrados.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "No se encontraron carritos" });
    }


    return res
      .status(200)
      .render("products/carts", { status: "success", carritos: carritosEncontrados });
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    return res
      .status(500)
      .json({
        status: "error",
        msg: "Error al obtener los carritos: " + error,
      });
  }
});

// Obtener un carrito por ID

router.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;

    const carritoEncontrado = await cartsModel.findById(id);

    console.log(carritoEncontrado);

    if (carritoEncontrado === null) {
      return res
        .status(404)
        .json({ status: "error", msg: `No existe carrito con el id ${id}` });
    }

    res.status(200).send({
      status: "success",
      msg: `Carrito con id ${carritoEncontrado._id} encontrado con exito`,
      carrito: carritoEncontrado,
    });
  } catch (error) {
    console.error("Error al buscar el carrito por ID", error);
    return res.status(500).json({
      status: "error",
      msg: "Error al buscar el carrito por ID " + error,
    });
  }
});

// Crear un carrito

router.post("/", async (req, res) => {
  try {
    const { id, quantity } = req.body;

    // Buscar el producto por su ID
    const producto = await productModel.findOne({ id_: id });

    if (!producto) {
      return res
        .status(404)
        .json({ status: "error", msg: "El producto no existe" });
    }

    // Crear un nuevo carrito con el producto y la cantidad especificada
    const nuevoCarrito = {
      productos: [{ product: producto._id, quantity: quantity }],
    };

    const carritoCreado = await cartsModel.create(nuevoCarrito);

    return res.status(200).json({
      status: "success",
      msg: `Nuevo carrito creado con id ${carritoCreado._id}`,
      carrito: carritoCreado,
    });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    return res
      .status(500)
      .json({ status: "error", msg: "Error al crear el carrito: " + error });
  }
});

// Agregar un producto a un carrito existente

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    // Buscar el producto por su ID
    const productoEncontrado = await productModel.findById(pid);

    // Verificar si el producto existe
    if (!productoEncontrado) {
      return res
        .status(404)
        .json({ status: "error", msg: `El producto con id ${pid} no existe` });
    }

    // Buscar el carrito por su ID
    const carritoEncontrado = await cartsModel.findById(cid);

    // Verificar si el carrito existe
    if (!carritoEncontrado) {
      return res
        .status(404)
        .json({ status: "error", msg: `El carrito con id ${cid} no existe` });
    }

    // Agregar el producto al carrito
    const updatedCarrito = await cartsModel.findByIdAndUpdate(
      cid,
      { $push: { productos: productoEncontrado._id } },
      { new: true }
    );

    // Devolver respuesta con el producto agregado y el carrito actualizado
    return res.status(200).json({
      status: "success",
      quantity: `${updatedCarrito.productos.length} productos en el carrito`,
      msg: `Producto con id ${pid} agregado con éxito al carrito ${cid}`,
      nuevoCarrito: updatedCarrito,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({
      status: "error",
      msg: "Error al agregar producto al carrito: " + error,
    });
  }
});

// Eliminar un carrito por su ID

router.delete("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;

    console.log(id);

    const carritoEncontrado = await cartsModel.findById(id);

    console.log(carritoEncontrado);

    if (carritoEncontrado === null) {
      return res
        .status(404)
        .json({ status: "error", msg: `El carrito con id ${id} no existe` });
    }

    const carritoEliminado = await cartsModel.deleteOne({ _id: id });

    if (carritoEliminado.deletedCount === 1) {
      console.log("Documento eliminado con éxito");
    } else {
      console.log("El documento no fue encontrado o no fue eliminado");
    }

    res.status(200).send({
      status: "success",
      msg: `Carrito con id ${id} eliminado con éxito`,
    });
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    return res
      .status(500)
      .json({ status: "error", msg: "Error al eliminar el carrito: " + error });
  }
});

// Eliminar del carrito el producto seleccionado

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const carritoEncontrado = await cartsModel.findById(cid);
    if (carritoEncontrado === null) {
      return res.status(404).json({
        status: "error",
        msg: `El carrito con el id ${cid} no existe`,
      });
    }

    const productoEncontrado = await productModel.findById(pid);
    if (productoEncontrado === null) {
      return res.status(404).json({
        status: "error",
        msg: `El producto con el id ${pid} no existe`,
      });
    }

    const index = carritoEncontrado.productos.indexOf(pid);
    if (index !== -1) {
      carritoEncontrado.productos.splice(index, 1);
    }

    await carritoEncontrado.save();

    return res.status(200).json({
      status: "success",
      msg: "Producto eliminado del carrito exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito: ", error);
    return res.status(500).json({
      status: "error",
      msg: "Error al eliminar el producto del carrito: " + error,
    });
  }
});

// Actualizar el carrito con los nuevos productos

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const { productos } = req.body;

    // Verificar si el carrito existe
    const carritoEncontrado = await cartsModel.findById(cid);
    if (!carritoEncontrado) {
      return res
        .status(404)
        .json({ status: "error", msg: `El carrito con id ${cid} no existe` });
    }

    // Actualizar los productos del carrito
    carritoEncontrado.productos = productos;

    // Guardar los cambios
    await carritoEncontrado.save();

    return res.status(200).json({
      status: "success",
      msg: `Carrito con id ${cid} actualizado con éxito`,
      carrito: carritoEncontrado,
    });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    return res.status(500).json({
      status: "error",
      msg: "Error al actualizar el carrito: " + error,
    });
  }
});

// Actualizar quantity

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    // Verificar si el carrito existe y obtenerlo con todos los detalles de los productos
    const carritoEncontrado = await cartsModel.findById(cid).populate('productos').exec();
    if (!carritoEncontrado) {
      return res.status(404).json({ status: "error", msg: `El carrito con id ${cid} no existe` });
    }

    // Verificar si el producto existe en el carrito
    const productoEncontrado = carritoEncontrado.productos.find(producto => producto._id.toString() === pid);
    if (!productoEncontrado) {
      return res.status(404).json({ status: "error", msg: `El producto con id ${pid} no existe en el carrito` });
    }

    // Actualizar la cantidad del producto encontrado
    productoEncontrado.quantity = quantity;

    // Guardar los cambios en la base de datos
    await carritoEncontrado.save();

    return res.status(200).json({ status: "success", msg: `La cantidad del producto en el carrito fue actualizada con éxito` });
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito:", error);
    return res.status(500).json({ status: "error", msg: "Error al actualizar la cantidad del producto en el carrito: " + error });
  }
});


router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    // Actualiza el carrito para eliminar todos los productos asociados
    const resultado = await cartsModel.updateOne(
      { _id: cid },
      { $set: { productos: [] } }
    );

    if (resultado.nModified === 0) {
      return res.status(404).json({
        status: "error",
        msg: `No se encontró ningún carrito con el id ${cid}`,
      });
    }

    return res.status(200).json({
      status: "success",
      msg: `Todos los productos del carrito con id ${cid} fueron eliminados`,
    });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    return res.status(500).json({
      status: "error",
      msg: "Error al eliminar productos del carrito: " + error,
    });
  }
});

export default router;
