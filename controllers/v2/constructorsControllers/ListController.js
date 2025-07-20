import BaseController from  './BaseController.js'
import { ListFromDb } from '../../../services/v2/ListService.js';

export class ListController extends BaseController {
    constructor() {
        super();
        const model = this.constructor.model;
        const serializer = this.constructor.serializer;
        if (!model) throw new Error("Defina static model na subclasse!");
        if (!serializer) throw new Error("Defina static serializer na subclasse!");
        this.model = model;
        this.serializer = serializer;
        this.service = new ListFromDb(model.table, serializer);
    }

    async get(req, res) {
        try {
            const data = await this.service.listAll(this.model.table);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}