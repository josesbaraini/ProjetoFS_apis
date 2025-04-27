import express from "express";
import { retornaTreinos, retornaTodosTreinos, retornaTreinosOrdenados, retornaTreinosNome } from "../services/retorno/retornaTreinos.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";
import { cadastraTreinos } from "../services/cadastro/cadastraTreinos.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let treinos;
    treinos = await retornaTodosTreinos()
    res.json(treinos);
});


router.post("/user", async (req, res) => {
    const { userId } = req.body
    let { ordem, nome } = req.query
    let treinos;
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {

        if (ordem) {
            treinos = await retornaTreinosOrdenados(userId, ordem)
        } else if (nome) {
            treinos = await retornaTreinosNome(userId, nome)
        } else {
            treinos = await retornaTreinos(userId)
        }

        res.json(treinos);
    }
});

router.post("/cadastrar/", async (req, res) => {
    const { usuario_id, nome, descricao, anotacoes, passos } = req.body
    const dados = {
        "usuario_id": usuario_id,
        "nome": nome,
        "descricao": descricao,
        "anotacoes": anotacoes,
        "passos":passos
    }
    console.log(dados);
    const resposta = await cadastraTreinos(dados)
    res.json(resposta)
})

export default router;