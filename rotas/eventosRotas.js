import express from "express";
import { retornaEventosId, retornaEventosMes, retornaEventosSemana } from "../services/retorno/retornaEventos.js";
import { cadastraEvento } from "../services/cadastro/cadastraEventos.js";
import { excluiEventosId } from "../services/exclusao/excluiEventos.js";
import { validaBodyID, validaParametroID } from "../services/validacoes/validaID.js";

const router = express.Router();

router.get('/pegarlista/:id', validaParametroID(), async (req, res) => {
    const { id } = req.params;
    const eventos = await retornaEventosId(id);
    if (eventos.length > 0) {
        res.status(200).json({ mensagem: "Lista de Eventos pega com sucesso;", "resposta": eventos });
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };
});

router.get('/pelomes/:id', validaParametroID(), async (req, res) => {
    const { id } = req.params;
    const { mes } = req.body;
    const eventos = await retornaEventosMes(id, mes);
    if (eventos.length > 0) {
        res.status(200).json({ mensagem: "Lista de Eventos pega com sucesso;", "resposta": eventos });
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };
});

router.get('/estasemana/:id', validaParametroID(), async (req, res) => {
    const { id } = req.params;
    const eventos = await retornaEventosSemana(id);
    if (eventos.length > 0) {
        res.status(200).json({ mensagem: "Lista de Eventos pega com sucesso;", "resposta": eventos });
    } else {
        res.status(404).json({ mensagem: "Nenhum evento desse usuario encontrado" });
    };
});
router.delete('/deletar/:id', validaParametroID(), async (req, res) => {
    const { id } = req.params;
    const resposta = await excluiEventosId(id);
    if (resposta.affectedRows > 0) {
        res.status(200).json({ "resposta": resposta, mensagem: "Evento deletado com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})

router.post('/cadastro', validaBodyID(), async (req, res) => {
    const { id, nome, descricao, data } = req.body;
    try {
        const resposta = await cadastraEvento(nome, descricao, data, id)
        if (resposta) {
            res.status(200).json({ mensagem: "Evento cadastrado com sucesso.", "resposta": resposta })
        }
        else {
            res.status(404).json({
                mensagem: "Um erro ocorreu durante o cadastro. ", "erro": resposta
            })
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Um erro ocorreu durante o cadastro. ", "erro": error })
    }
});

export default router;