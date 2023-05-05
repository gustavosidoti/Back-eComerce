import { messagesModel } from "./models/messages.models.js";


export class Messages {
    constructor(){

    }

    async get(){
        return await messagesModel.find().lean();
    }

    async getBy(filtro){
        return await messagesModel.findOne(filtro);
    }

    async save(message){
        return await messagesModel.create(message);
    }
}
