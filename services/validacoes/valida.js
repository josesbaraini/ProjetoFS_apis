
export function validaDadosBasicos() {
    return (req, res, next) => {
        const { peso, altura } = req.body;
        const campos = {};
        if (peso !== undefined) {
            const pesoNum = parseFloat(peso);
            if (isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 500) {
                return res.status(400).json({ "erro": "Peso fornecido é inválido." });
            }
            campos.peso = Math.round(pesoNum * 100);
        }
        if (altura !== undefined) {
            const alturaNum = parseFloat(altura);
            if (isNaN(alturaNum) || alturaNum <= 0.3 || alturaNum > 2.5) {
                return res.status(400).json({ "erro": "Altura fornecida é inválida." });
            }
            campos.altura = Math.round(alturaNum * 100);
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