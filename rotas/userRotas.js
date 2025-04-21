import express from "express";
import bcrypt from "bcrypt";
import { retornaParaLogin, retornaUsuarioId } from "../services/retorno/retornaUsuarios.js";
import { validaDados } from "../services/validacoes/valida.js";
import { cadastraUsuario } from "../services/cadastro/cadastraUsuario.js";
import { autenticar } from "../services/validacoes/autenticar.js";
import jwt from "jsonwebtoken";
import { retornaDadosAvancados, retornaDadosBasicos } from "../services/retorno/retornaDadosUsuario.js";
import { ehInteiro } from "../services/validacoes/testatipos.js";

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
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        res.status(200).json({ "usuario": usuario, 'token': token, 'mensagem': 'Logado com sucesso' })
    }

});

router.get('/autenticar', autenticar, (req, res) => {
    res.json({ mensagem: "Dados Autenticados" })
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
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
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
router.get("/informacoes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


        const usuario = await retornaUsuarioId(id);
        if (usuario.length > 0) {
            res.json(usuario[0]);
        } else {
            res.status(404).json({ mensagem: "Nenhum usuario encontrado com base no id fornecido" });
        }
    }
})

router.get('/dadosbasicos/:id', async (req, res) => {
    const id = req.params.id;

    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


        const usuario = await retornaDadosBasicos(id);
        if (usuario.length > 0) {
            res.json(usuario[0]);
        } else {
            res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
        }
    }
})

router.get('/dadosavancados/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (ehInteiro(id)) {
        res.status(404).json({ mensagem: "Id fornecido é invalido." })
    } else {


        const usuario = await retornaDadosAvancados(id);
        if (usuario.length > 0) {
            res.json(usuario[0]);
        } else {
            res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
        }
    }
})

export default router;