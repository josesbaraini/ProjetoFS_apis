import express from "express";
import { retornaEventosId, retornaEventosMes, retornaEventosSemana } from "../services/retorno/retornaEventos.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";
import { cadastraEvento } from "../services/cadastro/cadastraEventos.js";

const router = express.Router();

router.get('/pegarlista/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {

        const eventos = await retornaEventosId(id);
        if (eventos.length > 0) {
            res.status(200).json({ mensagem: "Lista de Eventos pega com sucesso;", "resposta": eventos });
        } else {
            res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
        };
    }
});

router.get('/pelomes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { mes } = req.body;
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


        const eventos = await retornaEventosMes(id, mes);
        if (eventos.length > 0) {
            res.status(200).json({ mensagem: "Lista de Eventos pega com sucesso;", "resposta": eventos });
        } else {
            res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
        };
    }
});

router.get('/estasemana/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


        const eventos = await retornaEventosSemana(id);
        if (eventos.length > 0) {
            res.status(200).json({ mensagem: "Lista de Eventos pega com sucesso;", "resposta": eventos });
        } else {
            res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
        };
    }
});

router.post('/cadastro', async (req, res) => {
    const { id, nome, descricao, data } = req.body;
    try {
        const resposta = await cadastraEvento(nome, descricao, data, id)
        if (resposta) {
            res.status(200).json({ mensagem: "Evento cadastrado com sucesso.", "resposta": resposta }) 
        }
        else {
            res.status(404).json({ mensagem: "Um erro ocorreu durante o cadastro. ", "erro" :resposta
            })
            
        }

    } catch (error) {
        res.status(500).json({ mensagem: "Um erro ocorreu durante o cadastro. ", "erro" :error })

    }



});

export default router;