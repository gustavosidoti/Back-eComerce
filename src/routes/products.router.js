const Router = require('express').Router;
const router = Router();


const { getProducts, getProductByPid, addProduct, updateProduct, deleteProduct } = require('../handlers/products.handler');

const fs = require ('fs');
const { v4: uuidv4 } = require('uuid');
const libreriaPath=require('path');

// Carga de archivo de productos
console.log(libreriaPath.join(__dirname, '../Products.json'));
path = libreriaPath.join(__dirname, '../Products.json');
const productsOn = fs.readFileSync(path, 'utf8');
const products = JSON.parse(productsOn);

router.get('/', getProducts);

router.get('/:pid', getProductByPid);

router.put('/:pid', updateProduct);

router.delete('/:pid', deleteProduct);

router.post('/', async(req, res) =>{

    let product = req.body;
    let io = req.serverSocket;
    console.log(req.body);
    if(!product.title || !product.description || !product.code || !product.price || !product.status
        || !product.stock || !product.category || !product.thumnails || product.pid){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({
            msg: "Error with any field"
        });

    }

    product.pid = uuidv4();
    products.push(product);

    await fs.promises.writeFile(path, JSON.stringify(products, null, 5));

    io.emit('editProduct', products);
   
    res.setHeader('Content-Type','application/json');
    res.status(201).json({
        message: "Ok..",
        product: product
    });

});

// exports
module.exports = router;