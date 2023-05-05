import mongoose from "mongoose";
import { config } from "../config/config.js";
import { userModels } from "./models/user.models.js";


export class User {
    constructor(){
        this.connection=mongoose.connect(config.database.MONGOURL,{dbName:config.database.DB})
                                    .then(conn=>console.log('Conectado a la DB...!!!'))
    }

    async get(){
        return await userModels.find({active:true});
    }

    async getBy(filtro){
        return await userModels.findOne(filtro)
                            .populate('role');
    }

    async save(user){
        return await userModels.create(user);
    }
}
