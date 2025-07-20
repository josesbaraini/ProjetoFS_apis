import { ListFromDb } from './ListService.js';

export class CreateListFromDb extends ListFromDb {


    async create(data) {

        const {query, values} = this.serializer.getCreateQuery(data);
       
        const response = await this.executaQuery(query, values);
       
        return response;
    }
}


