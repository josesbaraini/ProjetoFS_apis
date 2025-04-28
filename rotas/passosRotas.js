import express from "express";
import { retornaPassos, retornaTodosPassos, retornaPassosOrdenados, retornaPassosNome } from "../services/retorno/retornaPassos.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";
import { excluiPassoId, excluiPassos } from "../services/exclusao/excluiPassos.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let Passos;
    Passos = await retornaTodosPassos()
    res.json(Passos);
});

router.delete('/deletar/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


        const resposta = await excluiPassoId(id);
        if (resposta.affectedRows > 0) {
            res.status(200).json({"resposta":resposta, mensagem: "Passo deletado com sucesso." });
        } else {
            res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
        }
    }
})
router.post("/user", async (req, res) => {
        const {treino_Id} = req.body
        let {ordem, nome} = req.query
        let Passos;
        if (ehInteiro(id)) {
            res.status(404).json({ mensagem: "Id fornecido é invalido." })
        } else {
    
        if(ordem){
            Passos = await retornaPassosOrdenados(treino_Id, ordem) 
        }else if(nome){
            Passos = await retornaPassosNome(treino_Id, nome)
        }else{
            Passos = await retornaPassos(treino_Id)
        }

        res.json(Passos);}
});

export default router;