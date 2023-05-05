import { MiRouter } from "./router.js";

import { getCartsByCid, addCart, addProductInCart, deleteProductInCart, deleteAllProductsInCart, addProductQuantityInCart, updateCart, purchaseByCid } from '../handlers/carts.handler.js';

export class CartsRouter extends MiRouter {
    init(){
        this.get('/:cid',['PUBLIC'], getCartsByCid);

        this.post('/',['PUBLIC'], addCart);

        this.post('/:cid/product/:pid',['USUARIO'], addProductInCart);

        this.post('/:cid/purchase',['USUARIO'], purchaseByCid);

        this.put('/:cid/product/:pid',['USUARIO'], addProductQuantityInCart);

        this.put('/:cid',['PUBLIC'], updateCart);

        this.delete('/:cid/product/:pid',['PUBLIC'], deleteProductInCart);

        this.delete('/:cid',['PUBLIC'], deleteAllProductsInCart);
    }
}
