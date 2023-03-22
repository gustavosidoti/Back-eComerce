import * as fs from 'fs';
import  * as uuidv4 from 'uuid';
import * as path from 'path';
const __dirname = path.resolve();
import { cartsModel } from '../dao/models/carts.models.js';
import { productsModel } from '../dao/models/products.models.js';


const getCartsByCid = async (req, res) => {

    let cid = req.params.cid;
    try{
        let cartDB = await cartsModel.findById(cid)
                           .populate('products.pid');
        if( cartDB ){
            res.setHeader('Content-Type','application/json');
            res.status(200).json({
                ok: true,
                cart: cartDB
            });
        }else{
            res.setHeader('Content-Type','application/json');
            res.status(400).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }   
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }
};

const addCart = async (req, res) => {

    let cart = {
        products : [],
    };

    try {
        let cartAdded = await cartsModel.create(cart);

        res.setHeader('Content-Type','application/json');
        res.status(201).json({
        message: "Ok..",
        cart: cartAdded
    });
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }

}

const addProductInCart = async (req, res) => {

    let cid = req.params.cid;
    let pid = req.params.pid;

    try {
        // verifico el id valido de ese carro
        let cartDB = await cartsModel.findById(cid);

        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }
        // verifico si existe el producto que se intenta guardar
        const productDB = await productsModel.findById(pid);

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product with id ${pid}`
            });
        }

        // verifico si el producto existe en el carrito deseado
        
        let productIndex = cartDB.products.findIndex((item) => item.pid == pid);
        
        let cartUpdated;

        if (productIndex != -1) {

            cartDB.products[productIndex].quantity++;
            cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartDB, { new: true });
            
        } else {
            let cartItem = {
                "pid": pid,
                "quantity": 1
            };
            cartDB.products.push(cartItem);
            
            cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartDB, { new: true });
            
        }

        

        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            message: "Cart updated..",
            carts: cartUpdated
        });

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }

};

const addProductQuantityInCart = async (req, res) => {

    let cid = req.params.cid;
    let pid = req.params.pid;
    let { quantity } = req.body;

    if(quantity > 0){
        try {
            // verifico el id valido de ese carro
            let cartDB = await cartsModel.findById(cid);
    
            if (!cartDB) {
                return res.status(404).json({
                    ok: false,
                    msg: `Cannot find the cart with id ${cid}`
                });
            }
            // verifico si existe el producto que se intenta guardar
            const productDB = await productsModel.findById(pid);
    
            if (!productDB) {
                return res.status(404).json({
                    ok: false,
                    msg: `Cannot find the product with id ${pid}`
                });
            }
    
            // verifico si el producto existe en el carrito deseado
            
            let productIndex = cartDB.products.findIndex((item) => item.pid == pid);
            
            let cartUpdated;
    
            if (productIndex != -1) {
    
                cartDB.products[productIndex].quantity += quantity;
                cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartDB, { new: true });
                
            } else {
                let cartItem = {
                    "pid": pid,
                    "quantity": quantity
                };
                cartDB.products.push(cartItem);
                
                cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartDB, { new: true });
                
            }
    
            
    
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({
                message: "Cart updated..",
                carts: cartUpdated
            });
    
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            res.status(500).json({
                msg: "Cannot connect with database"
            });
        }
    } else {
        return res.status(404).json({
            ok: false,
            msg: `the quantity field is not found in the request`
        });
    }
    

};

const deleteProductInCart = async (req, res) => {

    let cid = req.params.cid;
    let pid = req.params.pid;

    try {
        // verifico el id valido de ese carro
        let cartDB = await cartsModel.findById(cid);

        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }
        // verifico si existe el producto que se intenta eliminar
        const productDB = await productsModel.findById(pid);

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product with id ${pid}`
            });
        }

        // verifico si el producto existe en el carrito deseado
        //let productIndex = await cartDB.products.findIndex({"pid": pid});
        let productIndex = cartDB.products.findIndex((item) => item.pid == pid);
        
        let cartUpdated;

        if (productIndex != -1) {
            // Quito el producto del carro
            cartDB.products.splice(productIndex, 1)

            // Actualizo el carro en la base de datos
            cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartDB, { new: true });
            
        } else {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product in cart`
            });
            
        }

        

        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            message: "Cart updated..",
            carts: cartUpdated
        });

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }
}

const deleteAllProductsInCart = async (req, res) => {

    let cid = req.params.cid;
    

    try {
        // verifico el id valido de ese carro
        let cartDB = await cartsModel.findById(cid);

        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }
        
        // Quito todos los productos del carro
        cartDB.products.length = 0;
        
        let cartUpdated;
        // Actualizo el carro en la base de datos
        cartUpdated = await cartsModel.findByIdAndUpdate(cid, cartDB);
        
        
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            message: "Cart updated..",
            carts: cartUpdated
        });

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }
}

const updateCart = async (req, res) => {
    console.log(req.body.products);
    await cartsModel.updateOne({_id:req.params.cid},{$set:{products: req.body.products}});
    res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            message: "Cart updated..",
        });
}

export  {
    getCartsByCid,
    addCart,
    addProductInCart,
    addProductQuantityInCart,
    deleteProductInCart,
    deleteAllProductsInCart,
    updateCart
}