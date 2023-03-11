import { Schema, model } from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new Schema({
    
    products: Array
});

cartSchema.method('toJSON', function() {

    const { // quitamos lo que no queremos devolver luego del post
        __v,
        _id,
        ...object
    } = this.toObject();
    object.cid = _id;
    return object;
});

export const cartsModel = model(cartsCollection, cartSchema);
