import express from "express";
import bcrypt from "bcrypt";
import { retornaParaLogin } from "../servicos/retornaUsuarios.js";
import { validaDados } from "../servicos/validacoes/valida.js";
import { cadastraUsuario } from "../servicos/cadastraUsuario.js";
import { autenticar } from "../servicos/validacoes/autenticar.js";
import jwt from "jsonwebtoken";

const router = express.Router();
router.post("/login", async (req, res) => {
    const { email, senha } = req.body
    const usuario = await retornaParaLogin(email)
    if (!usuario) {
        res.status(401).json({ error: "usuario não encontrado" })

    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
        res.status(401).json({ error: "senha incorreta" })
    } else {
        const token = jwt.sign({email}, 'secreto', {expiresIn:'1h'});
        res.cookie('token', token,{
            httpOnly:true,
            secure: false,
            sameSite: "lax"
        });
        res.status(200).json({ "usuario": usuario ,'token':token, 'mensagem':'Logado com sucesso'})
    }

});

router.get('/autenticar', autenticar, (req, res) =>{
    res.json({'mensagen':"Dados Autenticados"})
})

router.post('/cadastro', async (req, res) => {

    const { nome, email, telefone, senhaD } = req.body;
    const valida = validaDados(res, nome, email, telefone)
    if (!valida) {
        const senha = await bcrypt.hash(senhaD, 10)
        const resultado = await cadastraUsuario(nome, email, senha, telefone)
        console.log(resultado)
        if (resultado.errno == 1062) {
            return res.status(409).json({ erro: "O e-mail já está cadastrado. Tente outro e-mail." })
        } else {
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:'1h'});
            res.cookie('token', token,{
                httpOnly:true,
                secure: false,
                sameSite: "lax"
            });
            res.status(201).json({
                "mensagem": "Usuário cadastrado com sucesso.",
            })
        }
    } else {
        return valida
    }
})

export default router;