import { SerializerBase } from "./constructorsSerializers/SerializerBase.js";
import  UserModel  from "../../models/Usuarios.js";

export class UserSerializer extends SerializerBase {
    static model = UserModel;
    static fields = ['id', 'nome', 'email', 'role', 'data_nascimento', 'last_check', 'senha']
}