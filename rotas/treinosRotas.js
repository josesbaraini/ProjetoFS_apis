import express from "express";
import { retornaTreinos, retornaTodosTreinos, retornaTreinosOrdenados, retornaTreinosNome } from "../services/retorno/retornaTreinos.js";

const router = express.Router();

router.get("/", async (req, res) => {
    let treinos;
    treinos = await retornaTodosTreinos()
    res.json(treinos);
});


router.post("/user", async (req, res) => {
        const {userId} = req.body
        let {ordem, nome} = req.query
        let treinos;
        if(ordem){
            treinos = await retornaTreinosOrdenados(userId, ordem) 
        }else if(nome){
            treinos = await retornaTreinosNome(userId, nome)
        }else{
            treinos = await retornaTreinos(userId)
        }

        res.json(treinos);
});

export default router;