import express from "express";
import { retornaUsuarios } from "../services/retorno/retornaUsuarios.js";
import { validaParametroID } from "../services/validacoes/validaID.js";

const router = express.Router();

router.get("/userlist", async (req, res) => {
    let usuarios;
    usuarios = await retornaUsuarios()
    res.json(usuarios);
});

router.delete('/dadosbasicos/:id', validaParametroID(), async (req, res) => {
    const { id } = req.params;
    const usuario = await excluiDadosBasicos(id);
    if (usuario.affectedRows > 0) {
        res.status(200).json({ "resposta": usuario, mensagem: "Dados excluidos com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})

router.delete('/dadosavancados/:id', validaParametroID(), async (req, res) => {
    const { id } = req.params;
    const usuario = await excluiDadosAvancados(id);
    if (usuario.affectedRows > 0) {
        res.status(200).json({ "resposta": usuario, mensagem: "Dados excluidos com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado." });
    }
})

export default router;