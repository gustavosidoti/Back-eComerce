import { CartDto } from "../dto/cartDTO.js";


export class CartService{
    constructor(dao){
        this.dao=dao
    }

    async getCarts(){
        return await this.dao.get()
    }

    async getCartByCid(cid){
        let filter = {
          _id:cid
        }
        let cart= await this.dao.getBy(filter)
        return cart
    }

    async updateCart(cid, cart){
        return await this.dao.update(cid, cart);
    }
        


    async saveCart(cart){
        return await this.dao.save(cart)
    }

    async deleteCart(cid){
        
        return await this.dao.delete(cid);
        
    }

}