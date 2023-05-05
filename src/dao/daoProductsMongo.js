import mongoose from "mongoose";
import { config } from "../config/config.js";
import { productsModel } from "./models/products.models.js";


export class Products {
    constructor(){
        /*this.connection=mongoose.connect(config.database.MONGOURL,{dbName:config.database.DB})
                                    .then(conn=>console.log('Conectado a la DB...!!!'))*/
    }

    async get(filterElements, limitElements, pageActual,sortElements){
        if(filterElements){
            return await productsModel.paginate({category:{$in:[filterElements]}},{limit:limitElements, page:pageActual, sort:{price: sortElements}});
        }else{
            return await productsModel.paginate({status:true},{limit:limitElements, page:pageActual });
            //return await productsModel.find({status:true});   
        }
    }

    async getBy(filtro){
        return await productsModel.findOne(filtro);
    }

    async save(product){
        return await productsModel.create(product);
    }

    async update(pid, product){
        return await productsModel.findByIdAndUpdate(pid, product, { new: true });
    }

    async delete(pid, product){
        return await productsModel.findByIdAndUpdate(pid, product, { new: true });
    }

    async getPS(){
        return await productsModel.find();
    }
                
}
