import { SerializerBase } from "./constructorsSerializers/SerializerBase.js";
import  TreinosModel  from "../../models/Treinos.js";

export class TreinosSerializer extends SerializerBase {
    static model = TreinosModel;
    static fields = ['id', 'nome', 'descricao', "repetir", "data_treino", 'usuario_id']
}