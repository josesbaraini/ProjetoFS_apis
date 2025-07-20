import { ListController } from "./ListController.js";
import { CreateListFromDb } from "../../../services/v2/CreateListService.js";

export class CreateListController extends ListController {
    constructor(req) {
        super(req);
        this.service = new CreateListFromDb(this.model.table, this.serializer);
    }

    async post(req, res) {
        try {
            const result = await this.service.create(this.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}