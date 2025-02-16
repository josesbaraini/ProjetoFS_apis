import express from "express";
import bcrypt from "bcrypt";
import { retornaParaLogin } from "../servicos/retornaUsuarios.js";

const router = express.Router();

router.post("/login", async (req,res)=>{
    const {email,senha} = req.body
    const usuario = await retornaParaLogin(email)
    if (usuario.length === 0)   {
        return res.status(401).json({error:"usuario não encontrado"})
        
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
        return res.status(401).json({error: "senha incorreta"})
    }
    return res.json({id:usuario.id})
})

export default router;