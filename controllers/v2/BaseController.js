export default class BaseController {
    constructor() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (const method of methods) {
            if (typeof this[method] === 'function' && method !== 'constructor') {
             
                this[method] = this[method].bind(this);
            }
        }
    }

    asHandler() {

        return (req, res, next) => this.handler(req, res, next);
    }

    handler(req, res, next) {
        const method = req.method.toLowerCase();

        if (typeof this[method] === "function") {
            return this[method](req, res, next);
        }

        res.status(405).send("Método não permitido");
    }

    get(req, res) {
        res.status(405).send("GET não permitido");
    }

    post(req, res) {
        res.status(405).send("POST não permitido");
    }

    put(req, res) {
        res.status(405).send("PUT não permitido");
    }

    delete(req, res) {
        res.status(405).send("DELETE não permitido");
    }

    patch(req, res){
        res.status(405).send('PATCH não permitido')
    }
}