import * as fs from 'fs';
import  * as uuidv4 from 'uuid';
import * as path from 'path';
const __dirname = path.resolve();



// Carga de archivo de productos
// const pathProducts = './Products.json';

const pathProducts = path.join(__dirname,'/src/Products.json');
const productsOn = fs.readFileSync(pathProducts, 'utf8');
const products = JSON.parse(productsOn);

// carga de archivo de Carrito
const pathCarts = path.join(__dirname,'/src/Carts.json');
const CartsOn = fs.readFileSync(pathCarts, 'utf8');
const carts = JSON.parse(CartsOn);


const getCartsByCid = async (req, res) => {

    let cid = req.params.cid;

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
}

const addCart = async (req, res) => {

    let cart = {
        products : [],
    };
    


    cart.cid = uuidv4();
    carts.push(cart);

    await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, 5));

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
        message: "Ok..",
        cart: cart
    });


}

const addProductInCart = async (req, res) => {

    let cid = req.params.cid;
    let pid = req.params.pid;

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


}

export  {
    getCartsByCid,
    addCart,
    addProductInCart
}