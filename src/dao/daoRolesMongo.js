import { rolesModels } from "./models/roles.models.js";


export class Roles {
    constructor(){

    }

    async get(){
        return await rolesModels.find();
    }

    async getBy(filtro){
        return await rolesModels.findOne(filtro);
    }

    async save(role){
        return await rolesModels.create(role);
    }
}
