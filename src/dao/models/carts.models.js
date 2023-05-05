import { Schema, model } from "mongoose";
//var Product = mongoose.model('productsCollection');
const cartsCollection = 'carts';

const cartSchema = new Schema({
    
    products: [{
          pid: { 
            required: true,
            type: Schema.Types.ObjectId, 
            ref: "products" 
          },
          quantity: Number
    }],
    user: String
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
