import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("index", {})
});

//con Child Process - Fork 
router.get("/suma_02", (req, res) => {
    const child = fork("./src/forks/operations.js");
    child.send("Iniciar calculo");
    child.on("message", result => {
        res.send(`El resultado de la operacion es ${result}`);
    });
});

export default router;