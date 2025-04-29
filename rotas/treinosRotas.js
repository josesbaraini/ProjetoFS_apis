import express from "express";
import { retornaTreinos, retornaTodosTreinos, retornaTreinosOrdenados, retornaTreinosNome } from "../services/retorno/retornaTreinos.js";
import { cadastraTreinos } from "../services/cadastro/cadastraTreinos.js";
import { excluiTreinoId } from "../services/exclusao/excluiTreinos.js";
import { excluiPassos } from "../services/exclusao/excluiPassos.js";
import { validaParametroID, validaBodyID } from "../services/validacoes/validaID.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let treinos;
    treinos = await retornaTodosTreinos()
    res.json(treinos);
});


router.post("/user", validaBodyID('userId'), async (req, res) => {
    const { userId } = req.body
    let { ordem, nome } = req.query
    let treinos;
    if (ordem) {
        treinos = await retornaTreinosOrdenados(userId, ordem)
    } else if (nome) {
        treinos = await retornaTreinosNome(userId, nome)
    } else {
        treinos = await retornaTreinos(userId)
    }
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
    console.log(dados);
    const resposta = await cadastraTreinos(dados)
    res.json(resposta)
})
router.delete('/deletar/:id', validaParametroID(), async (req, res) => {
    const id = req.params.id;
    const respostaP = await excluiPassos(id);
    if (respostaP.affectedRows > 0) {
        const respostaT = await excluiTreinoId(id);
        res.status(200).json({ "resposta": respostaT, mensagem: "Treino deletado com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})
export default router;