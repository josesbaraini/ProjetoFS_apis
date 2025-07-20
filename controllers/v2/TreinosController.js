import TreinosModel from "../../models/Treinos.js";
import { TreinosSerializer } from "../../serializers/v2/TreinosSerializer.js";
import { CreateListController } from "../../controllers/v2/constructorsControllers/CreateListController.js";

export class TreinosListCreateController extends CreateListController {
    static model = TreinosModel;
    static serializer = new TreinosSerializer()
}