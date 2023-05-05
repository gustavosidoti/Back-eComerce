import { MiRouter } from "./router.js";

import { getProducts, getProductByPid, addProduct, updateProduct, deleteProduct } from '../handlers/products.handler.js';

export class ProductsRouter extends MiRouter{
    init(){

        this.get('/', ['PUBLIC'], getProducts);

        this.get('/:pid', ['PUBLIC'], getProductByPid);

        this.put('/:pid', ['ADMIN'], updateProduct);

        this.delete('/:pid', ['ADMIN'], deleteProduct);

        this.post('/', ['ADMIN'], addProduct);

    }
}