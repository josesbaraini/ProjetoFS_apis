import express from "express";
import { retornaNotificacoesId } from "../services/retorno/retornaNotificacoes.js";
const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const notificacoes = await retornaNotificacoesId(id);
    if (notificacoes.length > 0) {
        res.json(notificacoes);
    } else {
        res.status(404).json({ mensagem: "Nenhuma notificação desse usuario encontrado" });
    }
})



export default router;