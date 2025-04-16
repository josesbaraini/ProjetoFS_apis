import express from "express";
import { retornaUsuarios } from "../services/retorno/retornaUsuarios.js";

const router = express.Router();

router.get("/userlist", async (req, res) => {
        let usuarios;
        usuarios = await retornaUsuarios()
        res.json(usuarios);
});

export default router;