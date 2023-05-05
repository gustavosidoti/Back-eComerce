import { ProductDto } from "../dto/productDTO.js";


export class ProductService{
    constructor(dao){
        this.dao=dao
    }

    async getProducts(filterElements, limitElements, pageActual,sortElements){
        return await this.dao.get(filterElements, limitElements, pageActual,sortElements)
    }

    async getProductByPid(pid){
        let filter = {
          _id:pid
        }
        let product= await this.dao.getBy(filter)
        return product
    }

    async updateProduct(pid, product){
        return await this.dao.update(pid, product);
    }
        


    async saveProduct(product){
        return await this.dao.save(new ProductDto(product))
    }

    async deleteProduct(pid){
        let filter = {
            _id:pid
          }
        let product= await this.dao.getBy(filter)
        product.status = false;
        await this.dao.update(pid, product);
        return product
    }

    async getProductsSimple(){
        return await this.dao.getPS()
    }

    async getLastProductCode(){
        let ProductsDB = await this.dao.getPS()
        
        let lastProductIndex = ProductsDB[ProductsDB.length-1].code+1;
        
        return lastProductIndex;
    }

}