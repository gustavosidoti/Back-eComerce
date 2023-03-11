import { Schema, model } from "mongoose";

const productsCollection = 'products';

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, "El título es requerdido"],
        unique: [true, "El título no debe repetirse"]
    },
    description: String,
    code: {
        type: String,
        required: [true, "El código es requerdido"],
        unique: [true, "El código no debe repetirse"]
    },
    price: {
        type: Number,
        required: [true, "El precio es requerdido"]
    },
    status: Boolean,
    stock: {
        type: Number,
        required: [true, "El stock es requerdido"]
    },
    category: {
        type: String,
        required: [true, "La categoría es requerdida"]
    },
    thumnails: Array
});

productSchema.method('toJSON', function() {

    const { // quitamos lo que no queremos devolver luego del post
        __v,
        _id,
        ...object
    } = this.toObject();
    object.pid = _id;
    return object;
});

export const productsModel = model(productsCollection, productSchema);

