
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
            "Mensagen:": "Registro atuzalizado com sucesso",
            "Dados Alterados": dadosExtras
        });
    } else {
        return res.status(404).json({ "Erro:": "Registro Não encontrado" });
    }
}