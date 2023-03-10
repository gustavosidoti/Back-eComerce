import { Router } from "express";
const routerCart = Router();

import { getCartsByCid, addCart, addProductInCart } from '../handlers/carts.handler.js';

routerCart.get('/:cid', getCartsByCid);

routerCart.post('/', addCart);

routerCart.post('/:cid/product/:pid', addProductInCart);

export {routerCart};