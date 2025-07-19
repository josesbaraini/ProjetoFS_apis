import { ExecuteQueryClass } from './ExecuteQueryClass.js';

export class ListFromDb extends ExecuteQueryClass {
    constructor(tableName = null) {
        super();
        this.tableName = tableName || this.constructor.tableName;

        if (!this.tableName) {
            throw new Error("Defina static tableName na subclasse!");
        }
    }

    async listAll() {
        const query = `SELECT * FROM ${this.tableName}`;
        return await this.executaQuery(query);
    }
}


