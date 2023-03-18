import { Router } from "express";
const routerCart = Router();

import { getCartsByCid, addCart, addProductInCart, deleteProductInCart, deleteAllProductsInCart, addProductQuantityInCart } from '../handlers/carts.handler.js';

routerCart.get('/:cid', getCartsByCid);

routerCart.post('/', addCart);

routerCart.post('/:cid/product/:pid', addProductInCart);

routerCart.put('/:cid/product/:pid', addProductQuantityInCart);

routerCart.delete('/:cid/product/:pid', deleteProductInCart);

routerCart.delete('/:cid', deleteAllProductsInCart);

export {routerCart};