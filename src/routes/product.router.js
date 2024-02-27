import { Router } from "express"
import { getProductController, postProductController, putProductController, deleteProductController } from "../controllers/product.controller.js"
 
const router = Router();

router.get("/", getProductController)
router.post("/", postProductController)
router.put("/:id", putProductController)
router.delete("/:id", deleteProductController)

export default router;