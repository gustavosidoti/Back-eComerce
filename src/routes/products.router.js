import { Router } from "express";
const routerProducts = Router();


import { getProducts, getProductByPid, addProduct, updateProduct, deleteProduct } from '../handlers/products.handler.js';


routerProducts.get('/', getProducts);

routerProducts.get('/:pid', getProductByPid);

routerProducts.put('/:pid', updateProduct);

routerProducts.delete('/:pid', deleteProduct);

routerProducts.post('/', addProduct);

    

// exports
export {routerProducts};