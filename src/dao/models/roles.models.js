import { Schema, model } from "mongoose";

const rolesCollection='roles'
const rolesEschema=new Schema({
    codigo: Number, nombre: String, descripcion: String
},{
    timestamps:true,
    collection: 'roles'
})

export const rolesModel=model(rolesCollection, rolesEschema)