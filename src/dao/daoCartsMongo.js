import { cartsModel } from "./models/carts.models.js";


export class Cart {
    constructor(){

    }

    async get(){
        return await cartsModel.find();
    }

    async getBy(filtro){
        return await cartsModel.findOne(filtro)
                            .populate('products.pid');
    }

    async save(cart){
        return await cartsModel.create(cart);
    }

    async update(cid, cart){
        return await cartsModel.findByIdAndUpdate(cid, cart, { new: true });
    }
}