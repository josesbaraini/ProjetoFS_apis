
export function validaDadosBasicos() {
    return (req, res, next) => {
        const { peso, altura } = req.body
        const campos = {}
        if (peso !== undefined) {
            if (!/^\d+$/.test(peso)) {
                return res.status(400).json({ "erro": "Peso fornecido é invalido." })
            }

            const pesoNum = Number(peso);
            campos.peso = (peso.toString().length >= 2)
                ? pesoNum / (10 ** (peso.toString().length - 1))
                : pesoNum;

        }
        if (altura !== undefined) {
            if (!/^\d+$/.test(altura)) {
                return res.status(400).json({ "erro": "Altura fornecida é invalido." })
            }

            const alturaNum = Number(altura);
            campos.altura = (altura.toString().length >= 3)
                ? alturaNum / (10 ** (altura.toString().length - 2))
                : alturaNum;
        }

        req.body.campos = campos
        next()
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