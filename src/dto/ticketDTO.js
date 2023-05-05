export class TicketDto{
    constructor(ticket){
        this.code=ticket.code
        this.amount=ticket.amount
        this.purchaser=ticket.purchaser
        this.products= [{
            pid: cart.pid,
            quantity: cart.quantity
        }]
    }
}