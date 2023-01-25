
class ProductManager {

 constructor(){
    this.products=[];
 }

 getProducts(){
    return this.products;
 }

 getProductById( id ){
    let idValid = this.products.findIndex(index=> index.id === id);
    if(idValid === -1){
        console.log(`the id ${id} doesn´t exist in products`);
        return;
    }else{
        console.log(this.products[idValid]);
    }
 }

 addProduct( title, description, price, thumbnail, code, stock){
    let codeValid = this.products.findIndex(index=> index.code === code);
    if(codeValid === -1){
        let newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
    
        if(this.products.length === 0){
            newProduct.id = 1;
        }else{
            newProduct.id = this.products.length + 1;
        }
    
        this.products.push(newProduct);
    }else{
        console.log(`the code ${code} already exists in products`);
        return;
    }
    
}


}

let pm = new ProductManager();

console.log(pm.getProducts());

pm.addProduct("producto prueba","Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

console.log(pm.getProducts());

pm.addProduct("producto prueba","Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

pm.getProductById(1);
pm.getProductById(134);