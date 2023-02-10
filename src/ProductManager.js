
/* -------------------------------------------------------------------------- */
/*                       Desafío N° 3 Servidores con express                  */
/* -------------------------------------------------------------------------- */

const fs = require ('fs');


class ProductManager {

 constructor( myFile ){
    this.path=myFile;
 }

 async getProducts(){
    if(fs.existsSync(this.path)){
        let readJs = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(readJs);
    }else{
        return [];
    }
 }

 async getProductById( id ){

    if(fs.existsSync(this.path)){
        let products = await fs.promises.readFile(this.path, "utf-8");
        products = JSON.parse(products);

        // find the id
        let idValid = await products.findIndex(index=> index.id === id);
        if(idValid === -1){
            console.log(`the id ${id} doesn´t exist in products`);
            return;
         }else{
            console.log(products[idValid]);
        }



    }else{
        console.log("The product doesn´t exist");
    }

    
 }

    async addProduct( product ){
    
    let products = await this.getProducts();
    
    let codeValid = await products.findIndex(index=> index.name === product.name);

    if(codeValid === -1){
        
        product.id = products.length + 1;
    
       products.push(product);
    
        
       await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
       console.log("Producto añadido");
        

    }else{
        console.log(`the name ${product.name} already exists in ${this.path}`);
        return;
    }
    
}

async updateProduct( id, element, textModified ){

    if(fs.existsSync(this.path)){
        let products = await fs.promises.readFile(this.path, "utf-8");
        products = JSON.parse(products);

        // find the id
        let idValid = await products.findIndex(index=> index.id === id);
        if(idValid === -1){
            console.log(`the id ${id} doesn´t exist in products`);
            return;
         }else{
            switch (element) {
                case "name":
                    products[idValid].name = textModified;
                    break;
                case "category":
                    products[idValid].category = textModified;
                    break;
                case "img":
                    products[idValid].img = textModified;
                    break;
                case "price":
                    products[idValid].price = textModified;
                    break;
                case "id":
                    console.log("Error, the id field cannot be changed");
                    break;
                default:
                    break;
            }

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            let readJs = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(readJs);    
        }

    }else{
        console.log("The product doesn´t exist");
    }

}

async deleteProduct( id ){

    if(fs.existsSync(this.path)){
        let products = await fs.promises.readFile(this.path, "utf-8");
        products = JSON.parse(products);

        // find the id
        let idValid = await products.findIndex(index=> index.id === id);
        if(idValid === -1){
            console.log(`the id ${id} doesn´t exist in products`);
            return;
         }else{
            products.splice(idValid, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5));
            let readJs = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(readJs);
        }



    }else{
        console.log("The product doesn´t exist");
    }

    
 }

}

let Product = {
    name: "2022 Argentina Blue Training shirts",
    category: "Argentina",
    img: "https://us03-imgcdn.ymcart.com/50018/2022/04/27/f/c/fc15c3c4db1af59a.jpg",
    price: 14.50
};


let pm = new ProductManager("./Products.json");

pm.getProducts().then(read => {
    console.log(read);
    pm.addProduct(Product);
});


setTimeout(() => {
    pm.getProducts().then(read => console.log(read));
    pm.getProductById(1);
}, 3000);

setTimeout(() => {
    pm.updateProduct( 2, "name", "Zapatillas" ).then(read => console.log(read));
}, 4000);

setTimeout(() => {
    pm.deleteProduct(2).then(read => console.log(read));
}, 5000);
