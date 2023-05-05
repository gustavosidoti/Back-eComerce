import { ticketModels } from "./models/ticket.models.js";


export class Ticket {
    constructor(){

    }

    async get(){
        return await ticketModels.find();
    }

    async getBy(filtro){
        return await ticketModels.findOne(filtro);
    }

    async save(ticket){
        return await ticketModels.create(ticket);
    }
}
