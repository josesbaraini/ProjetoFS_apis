import BaseController from  './BaseController.js'

import { ListFromDb } from '../../../services/v2/ListService.js';

export class ListController extends BaseController {
    constructor() {
        super();
        this.tableName = this.constructor.tableName;
        

        if (!this.tableName) {
            throw new Error("Defina static tableName na subclasse!");
        }
        this.listService = new ListFromDb(this.tableName);
    }

    async get(req, res) {
        try {
            const data = await this.listService.listAll(this.tableName);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}