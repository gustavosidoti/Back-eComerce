import { Schema, model } from "mongoose";

const rolesColeccion='roles'
const rolesEschema=new Schema({
    codigo: Number, nombre: String, descripcion: String
},{
    timestamps:true,
    collection: 'roles'
})

export const rolesModel=model(rolesColeccion, rolesEschema)