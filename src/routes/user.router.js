import Router from "express";
import {
  registerController,
  loginController,
  logoutController
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController)

export default router;
