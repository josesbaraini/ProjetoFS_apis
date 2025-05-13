import jwt from "jsonwebtoken";

export async function autenticar(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            'erro': 'Não Autorizado'
        })


    }
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payLoad
        next()
    } catch (error) {
        return res.status(401).json({
            'erro': error
        })

    }
}

export async function autenticarAcao(req, res, next) {
    const token = req.cookies.token;
    const {id} = req.params 
    if (!token) {
        return res.status(401).json({
            'erro': 'Não Autorizado'
        })
    }
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET);
        if (payLoad.id === id || payLoad.role === 'admin') {
            console.log(payLoad)
            req.user = payLoad

            next() 
        }else{
            res.status(401).json({ mensagem: 'Acesso negado' })
        }

    } catch (error) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado'
        })

    }
}