import { Schema, model } from "mongoose";

const ticketCollection = 'ticket';
const ticketSchema = new Schema({
    code: String,
    amount: Number,
    purchaser: String,
    products: [{
        pid: { 
          required: true,
          type: Schema.Types.ObjectId, 
          ref: "products" 
        },
        quantity: Number
  }]
},{
    timestamps:{
        createdAt:'purchase_datetime'
    },
    collection: 'ticket'
})

export const ticketModels=model(ticketCollection, ticketSchema);