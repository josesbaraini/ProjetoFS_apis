import express from "express";
import { retornaEventosId } from "../services/retorno/retornaEventos.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";

const router = express.Router();

router.get('/pegarlista/:id', async (req, res) => {
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {

    const id = parseInt(req.params.id);
    const eventos = await retornaEventosId(id);
    if (eventos.length > 0) {
        res.json(eventos);
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };}
});



export default router;