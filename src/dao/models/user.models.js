import { Schema, model } from "mongoose";

const usersCollection ='users';
const userSchema=new Schema({
    name: String, 
    lastName: String, 
    email: {type: String, unique:true},
    password: String,
    age:Number,
    role:String
});

export const userModels=model(usersCollection, userSchema);