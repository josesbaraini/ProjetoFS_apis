export function tratamendoErros(res, erro) {
    console.log(erro)
    const errosPossiveis = {
        'ER_DUP_ENTRY': () => res.status(400).json({
            codigo: erro.code,
            mensagem: "Erro: Dado já cadastrado encontrado no Sistema"
        }),
        'ER_TRUNCATED_WRONG_VALUE': () => res.status(400).json({
            codigo: erro.code,
            mensagem: "Erro: tipo de dado inválido."
        }),
        'ER_BAD_NULL_ERROR': () => res.status(400).json({
            codigo: erro.code,
            mensagem: "Erro: campo obrigatório não preenchido."
        }),
        'ER_PARSE_ERROR': () => res.status(400).json({
            codigo: erro.code,
            mensagem: "Erro de sintaxe na query SQL."
        })
    };

    if (errosPossiveis[erro.code]) {
        return errosPossiveis[erro.code]();
    } else {
        return res.status(500).json({
            codigo: erro.code || 'ER_DESCONHECIDO',
            mensagem: `Erro desconhecido: ${erro.message || 'sem mensagem'}`
        });
    }
}
