import { Router } from "express";
const routerCart = Router();

import { getCartsByCid, addCart, addProductInCart, deleteProductInCart } from '../handlers/carts.handler.js';

routerCart.get('/:cid', getCartsByCid);

routerCart.post('/', addCart);

routerCart.post('/:cid/product/:pid', addProductInCart);

routerCart.delete('/:cid/product/:pid', deleteProductInCart);

export {routerCart};