import { MessageDto } from "../dto/messagesDTO.js";


export class MessageService{
    constructor(dao){
        this.dao=dao
    }

    async getMessage(){
        return await this.dao.get()
    }

    async getMessageByUser(user){
        let filter = {
          _id:user
        }
        let messages= await this.dao.getBy(filter)
        return messages
    }
        


    async saveMessage(message){
        return await this.dao.save(message)
    }

    

}