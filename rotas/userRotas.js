import express from "express";
import bcrypt from "bcrypt";
import { retornaFotoPerfil, retornaParaLogin, retornaUsuarioId } from "../services/retorno/retornaUsuarios.js";
import { respostaAtualizacao, validaDados, validaDadosAvancados, validaDadosBasicos, validaDadosUsuario, validarCampos } from "../services/validacoes/valida.js";
import { cadastraUsuario } from "../services/cadastro/cadastraUsuario.js";
import { autenticar, autenticarAcao } from "../services/validacoes/autenticar.js";
import jwt from "jsonwebtoken";
import { retornaDadosAvancados, retornaDadosBasicos } from "../services/retorno/retornaDadosUsuario.js";
import { cadastraDadosAvancados, cadastraDadosBasicos } from "../services/cadastro/cadastraDadosUsuario.js";
import { excluiDadosAvancados, excluiDadosBasicos } from "../services/exclusao/excluiDadosUsuario.js";
import { excluiUsuarioId } from "../services/exclusao/excluiUsuarios.js";
import { excluiTreinos } from "../services/exclusao/excluiTreinos.js";
import { excluiNotificacoesId } from "../services/exclusao/excluiNotificacoes.js";
import { excluiEventosId } from "../services/exclusao/excluiEventos.js";
import { excluiPassoIdUsuario, excluiPassos } from "../services/exclusao/excluiPassos.js";
import { validaParametroID } from "../services/validacoes/validaID.js";
import { atualizaDadosAvancados, atualizaDadosBasicos, atualizaFotoPerfil, atualizaUsuario } from "../services/atualizacao/atualizaUsuario.js";
import upload from "../services/validacoes/perfilImagens.js";
import path, { dirname } from "path"
import { tratamendoErros } from "../services/validacoes/tratamentoErros.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/C:\//, "/").replace("/rotas","");
const router = express.Router();
router.post("/login", async (req, res) => {
    const { email, senha } = req.body
    const usuario = await retornaParaLogin(email)
    if (!usuario) {
        return res.status(401).json({ error: "usuario não encontrado" })

    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
        res.status(401).json({ error: "senha incorreta." })
    } else {
        const token = jwt.sign({ 
            id: usuario.id,
            email: usuario.email,
            role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });
        res.status(200).json({ usuario: usuario, token: token, mensagem: 'Logado com sucesso' })
    }

});
router.post('/desconectar', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    });
    res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
  });
router.get('/autenticar', autenticar, (req, res) => {
    res.json({ mensagem: "Dados Autenticados" ,ok:true, usuario: req.user})
})

router.post('/cadastro', async (req, res) => {

    const { nome, email, telefone, senhaD } = req.body;
    const valida = validaDados(res, nome, email, telefone)
    if (!valida) {

        
        try {
            const senha = await bcrypt.hash(senhaD, 10)
            const resultado = await cadastraUsuario(nome, email, senha, telefone)
            console.log(resultado)

            const usuario = await retornaParaLogin(email)
            const token = jwt.sign({ 
                id: usuario.id,
                email: usuario.email,
                role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await cadastraDadosBasicos(usuario.id);
            await cadastraDadosAvancados(usuario.id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });
            res.status(201).json({ "usuario": usuario, 'token': token, "mensagem": "Usuário cadastrado com sucesso." })
            
        } catch (error) {
            tratamendoErros(res, error)
        }
            
    } else {
        return valida
    }
})
router.get("/informacoes/:id", validaParametroID(), autenticarAcao, async (req, res) => {
    const {id} = req.params;
    const usuario = await retornaUsuarioId(id);
    if (usuario.affectedRows > 0) {
        res.json(usuario[0]);
    } else {
        res.status(404).json({ mensagem: "Nenhum usuario encontrado com base no id fornecido" });
    }
})

router.delete("/deletar/:id", validaParametroID(),autenticarAcao, async (req, res) => {
    const id = req.params.id;
    let resposta = []
    let respostaI;
    respostaI = await excluiDadosBasicos(id)
    resposta.push(respostaI)
    respostaI = await excluiDadosAvancados(id);
    resposta.push(respostaI)
    respostaI = await excluiPassoIdUsuario(id)
    resposta.push(respostaI)
    respostaI = await excluiTreinos(id)
    resposta.push(respostaI)
    respostaI = await excluiNotificacoesId(id)
    resposta.push(respostaI)
    respostaI = await excluiEventosId(id)
    resposta.push(respostaI)
    console.log(resposta)
    const respostaF = await excluiUsuarioId(id);

    if (respostaF.affectedRows > 0) {


        res.status(200).json({ resposta: respostaF, mensagem: "Dados excluidos com sucesso." });
    } else {
        res.status(404).json({ mensagem: "Nenhum usuario encontrado com base no id fornecido" });
    }
})

router.get('/dadosbasicos/:id', validaParametroID(),autenticarAcao, async (req, res) => {
    const id = req.params.id;
    const usuario = await retornaDadosBasicos(id);
    if (usuario.length > 0) {
        res.json(usuario[0]);
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})

router.get('/dadosavancados/:id', validaParametroID(),autenticarAcao, async (req, res) => {
    const id = req.params.id;
    const usuario = await retornaDadosAvancados(id);
    if (usuario.length > 0) {
        res.json(usuario[0]);
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }

})

router.patch('/dadosavancados/:id', validaParametroID(), validaDadosAvancados(),autenticarAcao, async (req, res)=>{
    const { id } = req.params
    const { campos } = req.body
    if (!validarCampos(campos)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    const resultado = await atualizaDadosAvancados(id, campos);

    return respostaAtualizacao(res, resultado, {
        "IMC": campos.imc / 100,
        "Metabolismo Basal": campos.metabasal / 100,
        "Biotipo":campos.biotipo
    });


})

router.patch('/dadosbasicos/:id', validaParametroID(), validaDadosBasicos(),autenticarAcao, async (req, res) => {
    const { id } = req.params
    const { campos } = req.body

    if (!validarCampos(campos)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    const resultado = await atualizaDadosBasicos(id, campos);

    return respostaAtualizacao(res, resultado, {
        "peso": campos.peso / 100,
        "altura": campos.altura / 100
    });


})
router.get("/fotoPerfil/:id", validaParametroID(),autenticarAcao, async (req, res) => {
    const {id} = req.params
    const [imageUrl] = await retornaFotoPerfil(id)
    if (!imageUrl.fotoPerfil) {
        return res.status(404).json({"mensagen":"Foto de perfil não encontrada"})
    }
    const imagemPerfil = path.resolve(`${__dirname}/uploads`, imageUrl.fotoPerfil);
    return res.status(200).sendFile(imagemPerfil);
})
router.post('/fotoPerfil/:id',validaParametroID(),autenticarAcao, upload.single('profileImage'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    const {id} = req.params;
    const imageUrl = `${req.file.filename}`;
    const resultado = await atualizaFotoPerfil(id, imageUrl)
    return respostaAtualizacao(res, resultado, {
        "url":imageUrl
    })
  });
router.patch('/:id', validaParametroID(), validaDadosUsuario(),autenticarAcao, async (req, res) => {
    const {id} = req.params;
    const {campos} = req.body;

    if (!validarCampos(campos)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    const resultado = await atualizaUsuario(id, campos);

    return respostaAtualizacao(res, resultado, {
        "nome": campos.nome?campos.nome:"Dado Não Alterado",
        "email": campos.email?campos.email:"Dado Não alterado",
        "telefone": campos.telefone?campos.telefone:"Dado Não Alterado",
        "data_nascimento": campos["data_nascimento"]?campos["data_nascimento"]:"Dado Não alterado",
        "role":campos.role?campos.role:"Dado Não Alterado",
        "senha":campos.senha?"Senha Alterada":"Dado Não Alterado"
    });
    

    
})
export default router;