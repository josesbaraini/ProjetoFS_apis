import BaseController from  './BaseController.js'

export default class ListController extends BaseController {
    constructor() {
        super()
        model = this.model
        
    }



    get(req, res) {
        res.send("Listando usuarios..." + model);
    }

}