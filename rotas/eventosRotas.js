import express from "express";
import { retornaEventosId } from "../services/retorno/retornaEventos.js";

const router = express.Router();

router.get('/pegarlista/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const eventos = await retornaEventosId(id);
    if (eventos.length > 0) {
        res.json(eventos);
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };
});



export default router;