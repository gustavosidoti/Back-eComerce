import * as fs from 'fs';
import  * as uuidv4 from 'uuid';
import * as path from 'path';
const __dirname = path.resolve();
import { cartsModel } from '../dao/models/carts.models.js';
import { productsModel } from '../dao/models/products.models.js';


// Carga de archivo de productos
// const pathProducts = './Products.json';
/*
const pathProducts = path.join(__dirname,'/src/Products.json');
const productsOn = fs.readFileSync(pathProducts, 'utf8');
const products = JSON.parse(productsOn);

// carga de archivo de Carrito
const pathCarts = path.join(__dirname,'/src/Carts.json');
const CartsOn = fs.readFileSync(pathCarts, 'utf8');
const carts = JSON.parse(CartsOn);
*/

const getCartsByCid = async (req, res) => {

    let cid = req.params.cid;
    try{
        let cartDB = await cartsModel.findById(cid);
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
    // Para trabajar con filesystem
    /*
    let cart = await carts.find(e => e.cid == cid);
    if (cart) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            message: "Ok..",
            cart: cart
        });
    } else {
        res.status(400).json({
            error: `Cannot find the cart with id ${cid}`
        })
    }
    */
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
    
    // para trabajar con filesystem
    /*
    cart.cid = uuidv4();
    carts.push(cart);

    await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, 5));

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
        message: "Ok..",
        cart: cart
    });
    */

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
        //let productIndex = await cartDB.products.findIndex({"pid": pid});
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

    /*
    // Verifico si existe el carrito deseado
    let cartIndex = await carts.findIndex(e => e.cid == cid);
    let cartExist = cartIndex !== -1;
    if (cartExist) {

        // verifico si el producto existe en el carrito deseado
        let productIndex = await carts[cartIndex].products.findIndex((prod) => prod.pid === pid);

        if (productIndex != -1) {

            carts[cartIndex].products[productIndex].quantity++;

        } else {
            let cartItem = {
                "pid": pid,
                "quantity": 1
            };
            carts[cartIndex].products.push(cartItem);
        }

        // Actualizamos

        await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, 2));

        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            message: "Cart updated..",
            carts: carts
        });


    } else {
        return res.status(400).json({
            error: `Cannot find the cart with id ${cid}`
        })
    }
    */

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
        // verifico si existe el producto que se intenta guardar
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

            cartDB.products.splice(productIndex, 1)

            
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

export  {
    getCartsByCid,
    addCart,
    addProductInCart,
    deleteProductInCart
}