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