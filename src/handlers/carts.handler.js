import { cartsModel } from '../dao/models/carts.models.js';

import { cartService, productService, ticketService } from '../services/index.js';
import MisRespuestas from '../utils/customResponses.js';


const getCartsByCid = async (req, res) => {

    let cid = req.params.cid;
    try{
        let cartDB = await cartService.getCartByCid(cid)
                           
        if( cartDB ){
            MisRespuestas.respuestaExitosa(res,cartDB);
        }else{
            res.setHeader('Content-Type','application/json');
            res.status(400).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }   
    } catch (error) {
        console.log(error);
        MisRespuestas.errorServer(res, error);
    }
};

const addCart = async (req, res) => {

    

    let cart = {
        products : [],
        user: req.user.email
    };

    try {
        let cartAdded = await cartService.saveCart(cart);

        MisRespuestas.respuestaExitosa(res,cartAdded);
    
    } catch (error) {
        MisRespuestas.errorServer(res, error);
    }

}

const addProductInCart = async (req, res) => {

    let cid = req.params.cid;
    let pid = req.params.pid;

    try {
        // verifico el id valido de ese carro
        let cartDB = await cartService.getCartByCid(cid)

        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }
        // verifico si existe el producto que se intenta guardar
        const productDB = await productService.getProductByPid(pid);

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product with id ${pid}`
            });
        }
       
        // verifico si el producto existe en el carrito deseado
        
        let productIndex = cartDB.products.findIndex((item) => item.pid._id == pid);
        
        let cartUpdated;
        

        if (productIndex != -1) {

            cartDB.products[productIndex].quantity++;
            cartUpdated = await cartService.updateCart(cid, cartDB);
            
        } else {
            let cartItem = {
                "pid": pid,
                "quantity": 1
            };
            cartDB.products.push(cartItem);
            
            cartUpdated = await cartService.updateCart(cid, cartDB);
            
        }

        MisRespuestas.respuestaExitosa(res,cartUpdated);

    } catch (error) {
        MisRespuestas.errorServer(res, error);
    }

};

const addProductQuantityInCart = async (req, res) => {

    let cid = req.params.cid;
    let pid = req.params.pid;
    let { quantity } = req.body;

    if(quantity > 0){
        try {
            // verifico el id valido de ese carro
            let cartDB = await cartService.getCartByCid(cid)
    
            if (!cartDB) {
                return res.status(404).json({
                    ok: false,
                    msg: `Cannot find the cart with id ${cid}`
                });
            }
            // verifico si existe el producto que se intenta guardar
            const productDB = await productService.getProductByPid(pid);
    
            if (!productDB) {
                return res.status(404).json({
                    ok: false,
                    msg: `Cannot find the product with id ${pid}`
                });
            }
    
            // verifico si el producto existe en el carrito deseado
            
            let productIndex = cartDB.products.findIndex((item) => item.pid._id == pid);
            
            let cartUpdated;
    
            if (productIndex != -1) {
    
                cartDB.products[productIndex].quantity += quantity;
                cartUpdated = await cartService.updateCart(cid, cartDB);
                
            } else {
                let cartItem = {
                    "pid": pid,
                    "quantity": quantity
                };
                cartDB.products.push(cartItem);
                
                cartUpdated = await cartService.updateCart(cid, cartDB);
                
            }
    
            
    
            MisRespuestas.respuestaExitosa(res,cartUpdated);
    
        } catch (error) {
            MisRespuestas.errorServer(res, error);
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
        let cartDB = await cartService.getCartByCid(cid)

        if (!cartDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }
        // verifico si existe el producto que se intenta eliminar
        const productDB = await productService.getProductByPid(pid);

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product with id ${pid}`
            });
        }

        // verifico si el producto existe en el carrito deseado
        
        let productIndex = cartDB.products.findIndex((item) => item.pid._id == pid);
        
        let cartUpdated;

        if (productIndex != -1) {
            // Quito el producto del carro
            cartDB.products.splice(productIndex, 1)

            // Actualizo el carro en la base de datos
            cartUpdated = await cartService.updateCart(cid, cartDB);
            
        } else {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product in cart`
            });
            
        }

        MisRespuestas.respuestaExitosa(res,cartUpdated);

    } catch (error) {
        MisRespuestas.errorServer(res, error);
    }
}

const deleteAllProductsInCart = async (req, res) => {

    let cid = req.params.cid;
    

    try {
        // verifico el id valido de ese carro
        let cartDB = await cartService.getCartByCid(cid)

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
        cartUpdated = await cartService.updateCart(cid, cartDB);
        
        
        MisRespuestas.respuestaExitosa(res,cartUpdated);

    } catch (error) {
        MisRespuestas.errorServer(res, error);
    }
}

const purchaseByCid = async (req, res) => {

    let cid = req.params.cid;
    let email = req.user.email;
    try{
        let cartDB = await cartService.getCartByCid(cid)
                           
        if( !cartDB ){
            res.setHeader('Content-Type','application/json');
            res.status(400).json({
                ok: false,
                msg: `Cannot find the cart with id ${cid}`
            });
        }

        let productosEnCarro = cartDB.products
        let compraIncorrecta = [];
        let compraCorrecta = [];
        let total = 0;
        // recorro cada producto del carro
        for(let productCarro of productosEnCarro){
            
            // extraemos el producto de la coleccion productos
           let productDB = await productService.getProductByPid(productCarro.pid._id)
           
           
           // verifico stock
           if(productDB.stock > productCarro.quantity){
            // quito las unidades del stock en el objeto y actualizo en bd producto
            productDB.stock = productDB.stock - productCarro.quantity
            productService.updateProduct(productCarro.pid._id,productDB)

            // Quito el producto del carro
            let productIndex = cartDB.products.findIndex((item) => item.pid._id == productCarro.pid._id);
            cartDB.products.splice(productIndex, 1)

            // Actualizo el carro en la base de datos
            await cartService.updateCart(cid, cartDB);

            // Creo un array con los productos que si se van a comprar
            compraCorrecta.push({
                pid:productCarro.pid._id,
                quantity:productCarro.quantity
           })
            // Acumulo el total de la compra
           total = total + productCarro.quantity * productCarro.pid.price;

           

           }else{
            // creo un array con los productos que no se compraron
            compraIncorrecta.push({
                pid:productCarro.pid._id,
                quantity:productCarro.quantity
           })

           }
           
        }
        // Actualizo el carro en bd con el objeto que contiene los productos rechazados
       await cartsModel.updateOne({_id:cid},{$set:{products: compraIncorrecta}});

       if(compraCorrecta.length == 0){

        res.setHeader('Content-Type','application/json');
            res.status(400).json({
                ok: false,
                msg: "The purchase could not be completed. There is no stock in selected products"
            });

       }else{

        /* consulto el código del ultimo ticket
           Genero el ticket de compra
           almaceno en BD
        */
        let ticket = {}
        let lastTicketCode = 0;
        let ticketDB = await ticketService.getTickets();
       
        if(ticketDB.length == 0){
            lastTicketCode = 1;
        }else{
            lastTicketCode = await ticketService.getLastTicketCode();
        }

       ticket = {
        code: lastTicketCode,
        amount: total,
        purchaser: req.user.email,
        products: compraCorrecta
       }

       let ticketAdded = await ticketService.saveTicket(ticket);
    
    res.setHeader('Content-Type','application/json');
            res.status(200).json({
                ok: true,
                ProductosRechazados: compraIncorrecta,
                CarroNro: cid,
                user: email,
                ticket: ticketAdded
            });

       }
       
       

    } catch (error) {
        console.log(error);
        MisRespuestas.errorServer(res, error);
    }
};

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
    updateCart,
    purchaseByCid
}