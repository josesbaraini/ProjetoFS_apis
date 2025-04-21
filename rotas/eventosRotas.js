import express from "express";
import { retornaEventosId, retornaEventosMes, retornaEventosSemana } from "../services/retorno/retornaEventos.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";

const router = express.Router();

router.get('/pegarlista/:id', async (req, res) => {
    
    const id = parseInt(req.params.id);
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {

    const eventos = await retornaEventosId(id);
    if (eventos.length > 0) {
        res.json(eventos);
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };}
});

router.get('/pelomes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {mes} = req.body;
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


    const eventos = await retornaEventosMes(id,mes);
    if (eventos.length > 0) {
        res.json(eventos);
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };}
});

router.get('/estasemana/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


    const eventos = await retornaEventosSemana(id);
    if (eventos.length > 0) {
        res.json(eventos);
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };}
});


export default router;