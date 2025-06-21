import express from "express";
import { retornaTreinos, retornaTodosTreinos, retornaTreinosOrdenados, retornaTreinosNome, retornaTreinosComFiltros } from "../services/retorno/retornaTreinos.js";
import { cadastraTreinos } from "../services/cadastro/cadastraTreinos.js";
import { excluiTreinoId } from "../services/exclusao/excluiTreinos.js";
import { excluiPassos } from "../services/exclusao/excluiPassos.js";
import { validaParametroID, validaBodyID } from "../services/validacoes/validaID.js";
import { atualizaTreino } from "../services/atualizacao/atuzlizaTreinos.js";
import { respostaAtualizacao, validarCampos } from "../services/validacoes/valida.js";
import dayjs from "dayjs";
const router = express.Router();

router.get("/", async (req, res) => {
    let treinos;
    treinos = await retornaTodosTreinos()
    res.json(treinos);
});

router.get("/user/:userId", validaParametroID("userId"), async (req, res) => {
    const { userId } = req.params
    const { ordem, nome } = req.query

    let treinos;

    // Usa a nova função que combina pesquisa e ordenação
    treinos = await retornaTreinosComFiltros(userId, nome, ordem);


    res.json(treinos);
});

router.post("/cadastrar", validaBodyID('usuario_id'), async (req, res) => {
    const { usuario_id, nome, descricao, anotacoes, passos } = req.body
    const dados = {
        "usuario_id": usuario_id,
        "nome": nome,
        "descricao": descricao,
        "anotacoes": anotacoes,
        "passos": passos
    }
    const resposta = await cadastraTreinos(dados)
    res.json(resposta)
})

router.delete('/deletar/:idTreino', validaParametroID("idTreino"), async (req, res) => {
    const { idTreino } = req.params;
    const respostaP = await excluiPassos(idTreino);
    if (respostaP.affectedRows > 0) {
        const respostaT = await excluiTreinoId(idTreino);
        res.status(200).json({ "resposta": respostaT, mensagem: "Treino deletado com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})

router.patch("/:idTreino", validaParametroID("idTreino"), async (req, res) => {
    const { campos } = req.body
    const { idTreino } = req.params
    if (!validarCampos(campos)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    campos["modificacao_em"] = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const resultado = await atualizaTreino(idTreino, campos);

    return respostaAtualizacao(res, resultado, {
        "nome": campos.nome ? campos.nome : "Dado Não Alterado",
        "descricao": campos.descricao ? campos.descricao : "Dado Não Alterado",
        "anotacoes": campos.anotacoes ? campos.anotacoes : "Dado Não Alterado",
        "modificacao_em": campos["modificacao_em"]
    });

});

export default router;