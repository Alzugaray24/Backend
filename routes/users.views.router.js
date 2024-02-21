import { Router } from "express";
import passport from "passport";
import { authToken } from "../dirname.js";
import { passportCall, authorization } from "../dirname.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("session/login");
});

router.get("/register", (req, res) => {
  res.render("session/register");
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwtCookieToken");
  res.send({status: "success"})
});

router.get("/profile", passportCall("jwt"), authorization("user"), (req, res) => {
  res.render("session/profile", {
    user: req.user,
  });
});

router.get("/error", (req, res) => {
  res.render("error");
});

export default router;
