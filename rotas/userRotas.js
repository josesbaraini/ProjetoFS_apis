import express, { response } from "express";
import bcrypt from "bcrypt";
import { retornaParaLogin } from "../servicos/retornaUsuarios.js";
import { validaDados } from "../servicos/valida.js";
import { cadastraUsuario } from "../servicos/cadastraUsuario.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, senha } = req.body
    const usuario = await retornaParaLogin(email)
    if (!usuario) {
        return res.status(401).json({ error: "usuario não encontrado" })

    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
        return res.status(401).json({ error: "senha incorreta" })
    }
    return res.json({ id: usuario.id })
});

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
            return res.status(201).json({
                "mensagem": "Usuário cadastrado com sucesso.",
            })
        }
    } else {
        return valida
    }
})

export default router;