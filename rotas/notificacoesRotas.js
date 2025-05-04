import express from "express";
import { retornaNotificacoesId } from "../services/retorno/retornaNotificacoes.js";
import { cadastraNotificacao } from "../services/cadastro/cadastraNotificacoes.js";
import { excluiNotificacoesId } from "../services/exclusao/excluiNotificacoes.js";
import { validaBodyID, validaParametroID } from "../services/validacoes/validaID.js";
import { marcaNotificacaoLida } from "../services/atualizacao/atualizaNotificacoes.js";
import { respostaAtualizacao } from "../services/validacoes/valida.js";
const router = express.Router();

router.get('/:id', validaParametroID(), async (req, res) => {
    const id = req.params.id;
    const notificacoes = await retornaNotificacoesId(id);
    if (notificacoes.length > 0) {
        res.json(notificacoes);
    } else {
        res.status(404).json({ mensagem: "Nenhuma notificação desse usuario encontrado" });
    }
})

router.delete('/deletar/:id', validaParametroID(), async (req, res) => {
    const id = req.params.id;
    const resposta = await excluiNotificacoesId(id);
    if (resposta.affectedRows > 0) {
        res.status(200).json({ "resposta": resposta, mensagem: "Notificação deletado com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }

})

router.post('/cadastro', validaBodyID(), async (req, res) => {
    const { nome, assunto, tipo, id } = req.body;

    const resposta = await cadastraNotificacao(nome, assunto, tipo, id)
    if (resposta.affectedRows > 0) {
        res.status(200).json({ mensagem: "Notificação cadastrada com sucesso.", "resposta": resposta })
    } else {
        res.status(500).json({ mensagem: "Um erro ocorreu durante o cadastro. ", "erro": resposta })
    }



});

router.patch("/:id", validaParametroID(), async (req, res) => {
    const { id } = req.params

    const resultado = await marcaNotificacaoLida(id);

    return respostaAtualizacao(res, resultado, {
        "lida":true
    });

});

export default router;