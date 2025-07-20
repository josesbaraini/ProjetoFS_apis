import  BaseController  from './constructorsControllers/BaseController.js';
import { ListController } from './constructorsControllers/ListController.js';
import UserModel from "../../models/Usuarios.js";
export class UserListCreateController extends ListController {
    static model = UserModel;
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