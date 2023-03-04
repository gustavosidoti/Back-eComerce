const { response } = require("express");
const fs = require ('fs');
const { v4: uuidv4 } = require('uuid');
const libreriaPath=require('path');

// Carga de archivo de productos
console.log(libreriaPath.join(__dirname, '../Products.json'));
path = libreriaPath.join(__dirname, '../Products.json');
const productsOn = fs.readFileSync(path, 'utf8');
const products = JSON.parse(productsOn);


const getProducts = async(req, res) =>{

    const limit = Number(req.query.limit) || 0;
    if(limit != 0){
        productsLimit = products.slice(0,limit);
        res.setHeader('Content-Type','application/json');
        await res.json(productsLimit);
    }else{
        res.setHeader('Content-Type','application/json');
        await res.json(products);
    }
}

const getProductByPid = async(req, res) =>{

    let pid = req.params.pid;

    let product = await products.find(e => e.pid == pid);
    if( product ){
        res.setHeader('Content-Type','application/json');
        res.json(product);
    }else{
        res.json({
            error: `Cannot find the product with id ${pid}`
        })
    }   
}

const addProduct = async(req, res) =>{

    let product = req.body;
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
   
    res.setHeader('Content-Type','application/json');
    res.status(201).json({
        message: "Ok..",
        product: product
    });

}

const updateProduct = async(req, res) =>{

    let pid = req.params.pid;

    let productIndex = await products.findIndex(e => e.pid == pid);
    if( productIndex == -1 ){

        return res.status(400).json({
            error: `Cannot find the product with id ${pid}`
        })

    }

    let product = req.body; 

    if(!product.title || !product.description || !product.code || !product.price || !product.status
        || !product.stock || !product.category || !product.thumnails || product.pid ){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({
                msg: "Error with any field"
            });
    
    }
    
        // actualizamos
        products.splice(productIndex, 1);
        product.pid = pid;
    
        products.push(product);
    
        await fs.promises.writeFile(path, JSON.stringify(products, null, 5));
       
        res.setHeader('Content-Type','application/json');
        res.status(201).json({
            message: "Product updated..",
            products: products
        });
       

}

const deleteProduct = async (req, res) => {

    const pid = req.params.pid;

    let productIndex = await products.findIndex(e => e.pid == pid);
    if( productIndex == -1 ){

        return res.status(400).json({
            error: `Cannot find the product with id ${pid}`
        })

    }

    products.splice(productIndex, 1);

    await fs.promises.writeFile(path, JSON.stringify(products, null, 5));

    res.setHeader('Content-Type','application/json');
        res.status(200).json({
            message: "Product removed..",
            products: products
        });

}

module.exports = {
    getProducts,
    getProductByPid,
    addProduct,
    updateProduct,
    deleteProduct
}