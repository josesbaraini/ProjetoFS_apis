

export function validaDados(res,nome, email, telefone) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const nomeRegex = /^.{2,}$/
        if (!emailRegex.test(email)) {
           return res.status(400).json({erro:'O e-mail fornecido é inválido. Insira um e-mail válido.'})
            
        } else if(!nomeRegex.test(nome)) {
            return res.status(400).json({erro:"O nome fornecido é inválido. Insira um nome válido." })
        }else if(typeof telefone != 'undefined' && !telefoneRegex.test(telefone)){
            return res.status(400).json({erro:"O telefone fornecido é inválido. Insira um telefone válido."})

        }else{
            return false 
        }


}