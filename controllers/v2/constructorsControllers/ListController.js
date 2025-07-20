import BaseController from  './BaseController.js'
import { ListFromDb } from '../../../services/v2/ListService.js';

export class ListController extends BaseController {
    constructor() {
        super();
        const model = this.constructor.model;
        if (!model) throw new Error("Defina static model na subclasse!");
        this.model = model;
        this.listService = new ListFromDb(model.table);
    }

    async get(req, res) {
        try {
            const data = await this.listService.listAll(this.model.table);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}