import { ExecuteQueryClass } from './ExecuteQueryClass.js';

export class ListFromDb extends ExecuteQueryClass {
    constructor(tableName = null, serializer) {
        super();
        this.tableName = tableName || this.constructor.tableName;
        this.serializer = serializer || this.constructor.serializer;

        if (!this.tableName) {
            throw new Error("Defina static tableName na subclasse!");
        }

        if (!this.serializer) {
            throw new Error("Defina static serializer na subclasse!");
        }
    }

    async listAll() {
        const query = this.serializer.getSelectQuery();
        const [data] = await this.executaQuery(query);
        const dataSerializada = this.serializer.serialize(data);
        return dataSerializada;
    }
}


