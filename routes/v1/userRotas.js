import express from "express";
import bcrypt from "bcrypt";
import { cadastraNotificacao } from "../../services/v1/cadastro/cadastraNotificacoes.js";
import { retornaFotoPerfil, retornaParaLogin, retornaUsuarioId, retornaUsuarioLastCheck } from "../../services/v1/retorno/retornaUsuarios.js";
import { respostaAtualizacao, validaDados, validaDadosAvancados, validaDadosBasicos, validaDadosUsuario, validarCampos, validaDadosPessoais, validaSenha } from "../../services/v1/validacoes/valida.js";
import { cadastraUsuario } from "../../services/v1/cadastro/cadastraUsuario.js";
import { autenticar, autenticarAcao } from "../../services/v1/validacoes/autenticar.js";
import jwt from "jsonwebtoken";
import { retornaDadosAvancados, retornaDadosBasicos } from "../../services/v1/retorno/retornaDadosUsuario.js";
import { cadastraDadosAvancados, cadastraDadosBasicos } from "../../services/v1/cadastro/cadastraDadosUsuario.js";
import { excluiDadosAvancados, excluiDadosBasicos } from "../../services/v1/exclusao/excluiDadosUsuario.js";
import { excluiUsuarioId } from "../../services/v1/exclusao/excluiUsuarios.js";
import { excluiTreinos } from "../../services/v1/exclusao/excluiTreinos.js";
import { excluiNotificacoesId } from "../../services/v1/exclusao/excluiNotificacoes.js";
import { excluiEventosId } from "../../services/v1/exclusao/excluiEventos.js";
import { excluiPassoIdUsuario, excluiPassos } from "../../services/v1/exclusao/excluiPassos.js";
import { validaParametroID } from "../../services/v1/validacoes/validaID.js";
import { atualizaDadosAvancados, atualizaDadosBasicos, atualizaFotoPerfil, atualizaUsuario, atualizaDadosPessoais, atualizaSenha, atuzalizaLastCheck } from "../../services/v1/atualizacao/atualizaUsuario.js";
import upload from "../../services/v1/validacoes/perfilImagens.js";
import path, { dirname } from "path"
import { tratamendoErros } from "../../services/v1/validacoes/tratamentoErros.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/C:\//, "/").replace("/rotas", "");
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
            role: usuario.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    res.json({ mensagem: "Dados Autenticados", ok: true, usuario: req.user })
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
                role: usuario.role
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await cadastraDadosBasicos(usuario.id);
            await cadastraDadosAvancados(usuario.id);
            await cadastraNotificacao('Bem vindo!', `Olá ${nome}, seja bem vindo a mygym!, atualize seus dados na aba de Perfil`, "Sistema", usuario.id)

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
    const { id } = req.params;
    const usuario = await retornaUsuarioId(id);
    if (usuario.affectedRows > 0) {
        res.json(usuario[0]);
    } else {
        res.status(404).json({ mensagem: "Nenhum usuario encontrado com base no id fornecido" });
    }
})

router.get("/lastcheck/:id", validaParametroID(), autenticar, autenticarAcao, async (req, res) => {
    const { id } = req.params;
    const lastCheck = await retornaUsuarioLastCheck(id);

    if (lastCheck && lastCheck.length > 0) {
        res.json({
            last_check: lastCheck[0].last_check,
            data_formatada: lastCheck[0].last_check ? new Date(lastCheck[0].last_check).toLocaleDateString('pt-BR') : null
        });
    } else {
        res.status(404).json({ mensagem: "Nenhum last_check encontrado para este usuário" });
    }
})

router.patch("/lastcheck/:id", validaParametroID(), autenticar, autenticarAcao, async (req, res) => {
    const { id } = req.params;
    const resultado = await atuzalizaLastCheck(id);

    if (resultado.affectedRows > 0) {
        res.status(200).json({
            mensagem: "Last check atualizado com sucesso",
            ok: true
        });
    } else {
        res.status(404).json({
            mensagem: "Usuário não encontrado",
            ok: false
        });
    }
})

router.delete("/deletar/:id", validaParametroID(), autenticarAcao, async (req, res) => {
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

router.get('/dadosbasicos/:id', validaParametroID(), autenticarAcao, async (req, res) => {
    const id = req.params.id;
    const usuario = await retornaDadosBasicos(id);
    if (usuario.length > 0) {
        res.json(usuario[0]);
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }
})

router.get('/dadosavancados/:id', validaParametroID(), autenticarAcao, async (req, res) => {
    const id = req.params.id;
    const usuario = await retornaDadosAvancados(id);
    if (usuario.length > 0) {
        res.json(usuario[0]);
    } else {
        res.status(404).json({ mensagem: "Nenhum dado desse usuario encontrado" });
    }

})

router.patch('/dadosavancados/:id', validaParametroID(), validaDadosAvancados(), autenticarAcao, async (req, res) => {
    const { id } = req.params
    const { campos } = req.body
    if (!validarCampos(campos)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    const resultado = await atualizaDadosAvancados(id, campos);

    return respostaAtualizacao(res, resultado, {
        "IMC": campos.imc / 100,
        "Metabolismo Basal": campos.metabasal / 100,
        "Biotipo": campos.biotipo
    });


})

router.patch('/dadosbasicos/:id', validaParametroID(), validaDadosBasicos(), autenticarAcao, async (req, res) => {
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

router.patch('/dadospessoais/:id', validaParametroID(), validaDadosPessoais(), validaSenha(), autenticarAcao, async (req, res) => {
    const { id } = req.params
    const { campos } = req.body

    // Verifica se há campos para atualizar
    if (!campos || Object.keys(campos).length === 0) {
        return res.status(400).json({ "Erro:": "Nenhum campo foi enviado para atualização" });
    }

    // Os campos já foram validados pelos middlewares e estão em req.body.campos
    const camposValidados = req.body.campos;

    if (!validarCampos(camposValidados)) {
        return res.status(400).json({ "Erro:": "Nenhum campo válido foi enviado para atualização" });
    }

    // Separa dados pessoais da senha
    const { senha, ...dadosPessoais } = camposValidados;

    let resultado;
    let dadosAlterados = {};

    // Atualiza dados pessoais se existirem
    if (Object.keys(dadosPessoais).length > 0) {
        resultado = await atualizaDadosPessoais(id, dadosPessoais);
        dadosAlterados = { ...dadosPessoais };
    }

    // Atualiza senha se existir
    if (senha) {
        const resultadoSenha = await atualizaSenha(id, senha);
        dadosAlterados.senha = "Senha Alterada";

        // Se não atualizou dados pessoais, usa o resultado da senha
        if (!resultado) {
            resultado = resultadoSenha;
        }
    }

    return respostaAtualizacao(res, resultado, dadosAlterados);
})
router.get("/fotoPerfil/:id", validaParametroID(), autenticarAcao, async (req, res) => {
    const { id } = req.params
    const [imageUrl] = await retornaFotoPerfil(id)
    if (!imageUrl.fotoPerfil) {
        return res.status(404).json({ "mensagen": "Foto de perfil não encontrada" })
    }
    const imagemPerfil = path.resolve(`${__dirname}/uploads`, imageUrl.fotoPerfil);
    return res.status(200).sendFile(imagemPerfil);
})
router.post('/fotoPerfil/:id', validaParametroID(), autenticarAcao, upload.single('profileImage'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    const { id } = req.params;
    const imageUrl = `${req.file.filename}`;
    const resultado = await atualizaFotoPerfil(id, imageUrl)
    return respostaAtualizacao(res, resultado, {
        "url": imageUrl
    })
});
router.patch('/:id', validaParametroID(), validaDadosUsuario(), autenticarAcao, async (req, res) => {
    const { id } = req.params;
    const { campos } = req.body;

    if (!validarCampos(campos)) {
        return res.status(404).json({ "Erro:": "Nenhum campo valido foi enviado para atualização" });
    }
    const resultado = await atualizaUsuario(id, campos);

    return respostaAtualizacao(res, resultado, {
        "nome": campos.nome ? campos.nome : "Dado Não Alterado",
        "email": campos.email ? campos.email : "Dado Não alterado",
        "telefone": campos.telefone ? campos.telefone : "Dado Não Alterado",
        "data_nascimento": campos["data_nascimento"] ? campos["data_nascimento"] : "Dado Não alterado",
        "role": campos.role ? campos.role : "Dado Não Alterado",
        "senha": campos.senha ? "Senha Alterada" : "Dado Não Alterado"
    });



})
export default router;