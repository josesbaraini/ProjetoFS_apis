import express from "express";
import { retornaNotificacoesId } from "../services/retorno/retornaNotificacoes.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";
import { cadastraNotificacao } from "../services/cadastro/cadastraNotificacoes.js";
import { excluiNotificacoesId } from "../services/exclusao/excluiNotificacoes.js";
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

router.delete('/deletar/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {

        const resposta = await excluiNotificacoesId(id);
        if (resposta.affectedRows > 0) {
            res.status(200).json({"resposta":resposta, mensagem: "Notificação deletado com sucesso." });
        } else {
            res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
        }
    };
})

router.post('/cadastro', async (req, res) => {
    const {nome,assunto, tipo, id} = req.body;

        const resposta = await cadastraNotificacao(nome,assunto, tipo, id)
        if (resposta.affectedRows > 0) {
            res.status(200).json({ mensagem: "Notificação cadastrada com sucesso.", "resposta":resposta })
        }else{
            res.status(500).json({ mensagem: "Um erro ocorreu durante o cadastro. ", "erro" : resposta })
        }
        
    

});


export default router;