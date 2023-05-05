export class CartDto{
    constructor(cart){
        this.products= [{
            pid: cart.pid,
            quantity: cart.quantity
        }],
        this.user=cart.user

    }
}