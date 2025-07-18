import  BaseController  from './BaseController.js';

export class UserListCreateController extends BaseController {
    get(req, res) {
        res.send("Listando usuarios...");
    }

    post(req, res) {
        res.send("Criando um usuario...");
    }
}

export class UserDatailUpdateDeleteController extends BaseController {
    get(req, res) {
        res.status(405).send("testando GET "+ req.params.id);
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