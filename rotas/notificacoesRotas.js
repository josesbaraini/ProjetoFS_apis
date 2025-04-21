import express from "express";
import { retornaNotificacoesId } from "../services/retorno/retornaNotificacoes.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";
import { cadastraNotificacao } from "../services/cadastro/cadastraNotificacoes.js";
const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {

    const notificacoes = await retornaNotificacoesId(id);
    if (notificacoes.length > 0) {
        res.json(notificacoes);
    } else {
        res.status(404).json({ mensagem: "Nenhuma notificação desse usuario encontrado" });
    }}
})

router.post('/cadastro', async (req, res) => {
    const {nome,assunto, tipo, data, situacao, id} = req.body;
    try {
        const resposta = await cadastraNotificacao(nome,assunto, tipo, data, situacao, id)
        if (resposta) {
            res.status(200).json({ mensagem: "Notificação cadastrada com sucesso.", "resposta":resposta })
        }
        
    } catch (error) {
        res.status(500).json({ mensagem: "Um erro ocorreu durante o cadastro. ", "erro" : error })

    }

});


export default router;