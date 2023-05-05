export class ProductDto{
    constructor(producto){
        this.title=producto.title
        this.price=producto.price
        this.description=producto.description
        this.code=producto.code
        this.status=producto.status
        this.stock=producto.stock
        this.category=producto.category
        this.thumnails=producto.thumnails
    }
}