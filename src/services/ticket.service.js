
export class TicketService{
    constructor(dao){
        this.dao=dao
    }

    async getTickets(){
        return await this.dao.get()
    }

    async getTicketByTid(tid){
        let filter = {
          _id:tid
        }
        let ticket= await this.dao.getBy(filter)
        return ticket
    }

    async saveTicket(ticket){
        return await this.dao.save(ticket)
    }

    async getLastTicketCode(){
        let ticketsDB = await this.dao.get()
        
        let lastTicketIndex = parseInt(ticketsDB[ticketsDB.length-1].code, 10)+1;
        
        return lastTicketIndex;
    }

}