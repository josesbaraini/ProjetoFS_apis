import express from "express";
import { retornaPassos, retornaTodosPassos, retornaPassosOrdenados, retornaPassosNome } from "../services/retorno/retornaPassos.js";
import { excluiPassoId} from "../services/exclusao/excluiPassos.js";
import { validaBodyID, validaParametroID } from "../services/validacoes/validaID.js";
import { atualizaPasso, atualizaPassos } from "../services/atualizacao/atuzalizaPassos.js";
import { respostaAtualizacao, respostaAtualizacaoMultipla, validarCampos } from "../services/validacoes/valida.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let Passos;
    Passos = await retornaTodosPassos()
    res.json(Passos);
});

router.delete('/deletar/:id', validaParametroID(), async (req, res) => {
    const id = req.params.id;
    const resposta = await excluiPassoId(id);
    if (resposta.affectedRows > 0) {
        res.status(200).json({ "resposta": resposta, mensagem: "Passo deletado com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})
router.post("/user", validaBodyID("treino_Id"), async (req, res) => {
    const { treino_Id } = req.body
    let { ordem, nome } = req.query
    let Passos;

        if (ordem) {
            Passos = await retornaPassosOrdenados(treino_Id, ordem)
        } else if (nome) {
            Passos = await retornaPassosNome(treino_Id, nome)
        } else {
            Passos = await retornaPassos(treino_Id)
        }

        res.json(Passos);
});



router.patch("/treino/", async (req, res) => {
    const {passos} = req.body;
    if (passos.length <= 0) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    
    const resultado = await atualizaPassos(passos);
    const respostaFinal = []
    for (const [index, resposta] of resultado.entries()) {
        const item = respostaAtualizacaoMultipla(resposta, {
            "id":passos[index].id?passos[index].id:"Dado Não Alterado",
            "nome":passos[index].nome?passos[index].nome:"Dado Não Alterado",
            "series":passos[index].series?passos[index].series:"Dado Não Alterado",
            "repeticoes":passos[index].repeticoes?passos[index].repeticoes:"Dado Não Alterado",
            "peso":passos[index].peso?passos[index].peso:"Dado Não Alterado"
        });
        respostaFinal.push(item)
    }
    return res.json(respostaFinal)

})

router.patch("/:idPasso", validaParametroID("idPasso"), async (req, res) => {
    const { passo } = req.body
    const { idPasso } = req.params
    if (!validarCampos(passo)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    const resultado = await atualizaPasso(idPasso, passo);

    return respostaAtualizacao(res, resultado, {
        "nome":passo.nome?passo.nome:"Dado Não Alterado",
        "series":passo.series?passo.series:"Dado Não Alterado",
        "repeticoes":passo.repeticoes?passo.repeticoes:"Dado Não Alterado",
        "peso":passo.peso?passo.peso:"Dado Não Alterado"
    });

});

export default router;