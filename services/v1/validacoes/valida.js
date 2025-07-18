import dayjs from "dayjs";
import bcrypt from "bcrypt";
const nomeRegex = /^.{2,}$/
export function validaDadosBasicos() {
    return (req, res, next) => {
        const { peso, altura } = req.body;
        const campos = {};
        if (peso !== undefined) {
            if (typeof peso !== "number") {
                return res.status(400).json({ "erro": "Peso deve ser um dado númerico." });
            }
            const pesoStr = String(peso).trim();
            if (!/^\d+(\.\d+)?$/.test(pesoStr)) {
                return res.status(400).json({ "erro": "Peso fornecido é inválido." });
            }
            const pesoNum = parseFloat(pesoStr);

            if (pesoNum <= 0 || pesoNum > 500) {
                return res.status(400).json({ "erro": "Peso fornecido é inválido." });
            }
            campos.peso = Math.round(pesoNum * 100);
        }
        if (altura !== undefined) {
            if (typeof altura !== "number") {
                return res.status(400).json({ "erro": "Altura deve ser um dado númerico." });
            }
            const alturaStr = String(altura).trim();
            if (!/^\d+(\.\d+)?$/.test(alturaStr)) {
                return res.status(400).json({ "erro": "Altura fornecida é inválida." });
            }
            const alturaNum = parseFloat(alturaStr);
            if (alturaNum <= 0.3 || alturaNum > 2.5) {
                return res.status(400).json({ "erro": "Altura fornecida é incompativel." });
            }
            campos.altura = Math.round(alturaNum * 100);
        }

        req.body.campos = campos;
        next();
    };
}

export function validaDadosPessoais() {
    return (req, res, next) => {
        const { campos } = req.body;
        const camposValidados = {};

        // Regex para validação
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;

        // Validação do nome
        if (campos?.nome !== undefined) {
            const nomeLimpo = String(campos.nome).trim();
            if (!nomeRegex.test(nomeLimpo)) {
                return res.status(400).json({
                    erro: "Nome fornecido é inválido. Deve conter apenas letras e espaços, entre 2 e 50 caracteres."
                });
            }
            camposValidados.nome = nomeLimpo;
        }

        // Validação do telefone
        if (campos?.telefone !== undefined) {
            const telefoneLimpo = String(campos.telefone).trim();
            if (!telefoneRegex.test(telefoneLimpo)) {
                return res.status(400).json({
                    erro: "Telefone fornecido é inválido. Use o formato (XX) XXXXX-XXXX."
                });
            }
            camposValidados.telefone = telefoneLimpo;
        }

        // Validação do email
        if (campos?.email !== undefined) {
            const emailLimpo = String(campos.email).trim();
            if (!emailRegex.test(emailLimpo)) {
                return res.status(400).json({
                    erro: "Email fornecido é inválido. Insira um email válido."
                });
            }
            camposValidados.email = emailLimpo;
        }

        // Validação da data de nascimento
        if (campos?.dataNascimento !== undefined) {
            const dataLimpa = String(campos.dataNascimento).trim();

            // Aceita tanto formato DD/MM/YYYY quanto YYYY-MM-DD
            let dataFormatada;
            if (dataLimpa.includes('/')) {
                // Converte DD/MM/YYYY para YYYY-MM-DD
                const partes = dataLimpa.split('/');
                if (partes.length === 3) {
                    dataFormatada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                } else {
                    return res.status(400).json({
                        erro: "Data de nascimento fornecida é inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD."
                    });
                }
            } else {
                dataFormatada = dataLimpa;
            }

            if (!dataValida(dataFormatada)) {
                return res.status(400).json({
                    erro: "Data de nascimento fornecida é inválida. Deve ser uma data válida entre 1900 e hoje."
                });
            }
            camposValidados.data_nascimento = dataFormatada;
        }

        // Mescla com campos existentes se houver
        req.body.campos = { ...req.body.campos, ...camposValidados };
        next();
    };
}

export function validaSenha() {
    return async (req, res, next) => {
        const { campos } = req.body;
        const camposValidados = {};

        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (campos?.senha !== undefined) {
            const senhaLimpa = String(campos.senha).trim();
            if (!senhaRegex.test(senhaLimpa)) {
                return res.status(400).json({
                    erro: "Senha fornecida é inválida. Deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial."
                });
            }
            const senhaCriptografada = await bcrypt.hash(senhaLimpa, 10);
            camposValidados.senha = senhaCriptografada;
        }

        // Mescla com campos existentes se houver
        req.body.campos = { ...req.body.campos, ...camposValidados };
        next();
    };
}

export function validaDadosAvancados() {
    return (req, res, next) => {
        const { metabasal, biotipo, imc } = req.body;
        const campos = {};

        if (imc !== undefined) {
            if (typeof imc !== "number") {
                return res.status(400).json({ erro: "IMC deve ser um dado numérico." });
            }
            if (imc <= 7 || imc > 85) {
                return res.status(400).json({ erro: "IMC fornecido é incompatível." });
            }
            campos.imc = Math.round(imc * 100);
        }
        if (metabasal !== undefined) {
            if (typeof metabasal !== "number") {
                return res.status(400).json({ erro: "Metabolismo basal deve ser um dado numérico." });
            }
            if (metabasal <= 1000 || metabasal > 5000) {
                return res.status(400).json({ erro: "Metabolismo basal fornecido é incompatível." });
            }
            campos.metabasal = Math.round(metabasal * 100);
        }

        if (biotipo !== undefined) {
            const biotiposValidos = ["mesomorfo", "endomorfo", "ectomorfo"];
            const bio = String(biotipo).trim().toLowerCase();
            if (!biotiposValidos.includes(bio)) {
                return res.status(400).json({ erro: "Biotipo fornecido é inválido." });
            }
            campos.biotipo = bio;
        }

        req.body.campos = campos;
        next();
    };
}

export function validaDadosUsuario() {
    return async (req, res, next) => {
        const { email, nome, role, senha, dataNascimento, telefone } = req.body
        const campos = {}
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        const nomeRegex = /^.{2,}$/
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        if (email !== undefined) {
            const emailLimpo = String(email).trim()
            if (!emailRegex.test(emailLimpo)) {
                return res.status(400).json({ erro: "Email fornecido é inválido." });
            }
            campos.email = emailLimpo
        }
        if (nome !== undefined) {
            const nomeLimpo = String(nome).trim();
            if (!nomeRegex.test(nomeLimpo)) {
                return res.status(400).json({ erro: "Nome fornecido é inválido." });
            }
            campos.nome = nomeLimpo
        }
        if (telefone !== undefined) {
            const telefoneLimpo = String(telefone).trim();
            if (!telefoneRegex.test(telefoneLimpo)) {
                return res.status(400).json({ erro: "Telefone fornecido é inválido." });
            }
            campos.telefone = telefone
        }
        if (senha !== undefined) {
            const senhaLimpa = String(senha).trim();
            if (!senhaRegex.test(senhaLimpa)) {
                return res.status(400).json({ erro: "Senha fornecida é inválida." });
            }
            const senhaC = await bcrypt.hash(senhaLimpa, 10)
            campos.senha = senhaC
        }
        if (dataNascimento !== undefined) {
            const dataNascimentoLimpo = String(dataNascimento).trim();
            if (!dataValida(dataNascimentoLimpo)) {
                return res.status(400).json({ erro: "Data de nascimento fornecida é inválida." });
            }
            campos["data_nascimento"] = dataNascimentoLimpo;
        }
        req.body.campos = campos
        next();
    }
}

export function validaDadosEventos() {
    return async (req, res, next) => {
        const campos = {}
        const { nome, descricao, data } = req.body
        if (nome !== undefined) {
            const nomeLimpo = String(nome).trim();
            if (!nomeRegex.test(nomeLimpo)) {
                return res.status(400).json({ erro: "Nome fornecido é inválido." });
            }
            campos.nome = nomeLimpo
        }
        if (descricao !== undefined) {
            const descricaoLimpo = String(descricao).trim();
            if (!nomeRegex.test(descricaoLimpo)) {
                return res.status(400).json({ erro: "Descrição fornecida é inválida." });
            }
            campos.descricao = descricaoLimpo
        }
        if (data !== undefined) {
            const dataLimpo = String(data).trim();
            if (!dayjs(dataLimpo, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ erro: "Data fornecida é inválida." });
            }
            campos.data = dataLimpo
        }
        req.body.campos = campos;
        next();

    }
}

export function validaDados(res, nome, email, telefone) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const nomeRegex = /^.{2,}$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ erro: 'O e-mail fornecido é inválido. Insira um e-mail válido.' })

    } else if (!nomeRegex.test(nome)) {
        return res.status(400).json({ erro: "O nome fornecido é inválido. Insira um nome válido." })
    } else if (typeof telefone != 'undefined' && !telefoneRegex.test(telefone)) {
        return res.status(400).json({ erro: "O telefone fornecido é inválido. Insira um telefone válido." })

    } else {
        return false
    }


}

export function validarCampos(campos = {}) {
    return Object.keys(campos).length > 0;
}

export function respostaAtualizacao(res, resultado, dadosExtras = {}) {
    if (resultado.affectedRows > 0) {
        return res.status(202).json({
            "Mensagen:": "Registro atualizado com sucesso",
            "Dados Alterados": dadosExtras,
            'ok': true
        });
    } else {
        return res.status(404).json({ "Erro:": "Registro Não encontrado" });
    }
}


export function respostaAtualizacaoMultipla(resultado, dadosExtras = {}) {
    if (resultado.affectedRows > 0) {
        return {
            sucesso: true,
            mensagem: "Registro atualizado com sucesso",
            dados: dadosExtras
        };
    } else {
        return {
            sucesso: false,
            erro: "Registro não encontrado"
        };
    }
}
function dataValida(str) {
    const data = dayjs(str, 'YYYY-MM-DD', true);

    if (!data.isValid()) return false;

    const minData = dayjs('1900-01-01');
    const maxData = dayjs();

    return data.isAfter(minData) && data.isBefore(maxData);
}