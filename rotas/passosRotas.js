import express from "express";
import { retornaPassos, retornaTodosPassos, retornaPassosOrdenados, retornaPassosNome } from "../services/retornaPassos.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let Passos;
    Passos = await retornaTodosPassos()
    res.json(Passos);
});


router.post("/user", async (req, res) => {
        const {treino_Id} = req.body
        let {ordem, nome} = req.query
        let Passos;
        if(ordem){
            Passos = await retornaPassosOrdenados(treino_Id, ordem) 
        }else if(nome){
            Passos = await retornaPassosNome(treino_Id, nome)
        }else{
            Passos = await retornaPassos(treino_Id)
        }

        res.json(Passos);
});

export default router;