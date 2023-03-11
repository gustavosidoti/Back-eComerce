import * as fs from 'fs';
import  * as uuidv4 from 'uuid';
import * as libreriaPath from 'path';
const __dirname = libreriaPath.resolve();
import { productsModel } from '../dao/models/products.models.js';

// Carga de archivo de productos usar FILESYSTEM
/*
console.log(libreriaPath.join(__dirname, '/src/products.json'));
const path = libreriaPath.join(__dirname, '/src/products.json');
const productsOn = fs.readFileSync(path, 'utf8');
const products = JSON.parse(productsOn);
*/

const getProducts = async(req, res) =>{

    let productoDB;

    try {
        
        productoDB = await productsModel.find();

        res.setHeader('Content-Type','application/json');
        await res.status(200).json({
            msg: "ok",
            products: productoDB
        });

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({
            msg: "Error al obtener los datos de la DB"
        });
    }
    
    /*const limit = Number(req.query.limit) || 0;
    if(limit != 0){
        const productsLimit = products.slice(0,limit);
    */

};

const getProductByPid = async(req, res) =>{

    let pid = req.params.pid;
    try {

        // CON FILESYSTEM
        //let product = await products.find(e => e.pid == pid);
        productoDB = await productsModel.findById(pid);
    if( product ){
        res.setHeader('Content-Type','application/json');
        res.status(200).json({
            ok: true,
            product: product
        });
    }else{
        res.setHeader('Content-Type','application/json');
        res.status(400).json({
            ok: false,
            msg: `Cannot find the product with id ${pid}`
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

const addProduct = async(req, res) =>{

    let product = req.body;
    try {
        if(!product.title || !product.description || !product.code || !product.price || !product.status
            || !product.stock || !product.category || !product.thumnails || product.pid){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({
                msg: "Error with any field"
            });
        }

        let productAdded = await productsModel.create(product);

        res.setHeader('Content-Type','application/json');
        res.status(201).json({
        message: "Ok..",
        product: productAdded
    });

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }
    

    // PARA TRABAJAR CON FILESYSTEM
    /*product.pid = uuidv4();
    products.push(product);
    await fs.promises.writeFile(path, JSON.stringify(products, null, 5));
    */
   
    

}

const updateProduct = async(req, res) =>{

    let pid = req.params.pid;

    try {
        // verifico el id valido de ese usuario
        const productDB = await productsModel.findById(pid);

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product with id ${pid}`
            });
        }
        // CON FILESYSTEM
        /*
        let productIndex = await products.findIndex(e => e.pid == pid);
        if( productIndex == -1 ){

            return res.status(400).json({
                error: `Cannot find the product with id ${pid}`
            })
        }
        */

        let product = req.body; 

        if(!product.title || !product.description || !product.code || !product.price || !product.status
        || !product.stock || !product.category || !product.thumnails || product.pid ){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({
                msg: "Error with any field"
            });
        }

        // si pasó todo lo anterior actualizamos
        const productUpdated = await productsModel.findByIdAndUpdate(pid, product, { new: true });

        res.setHeader('Content-Type','application/json');
        res.status(201).json({
            message: "Product updated..",
            products: productUpdated
        });

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }
    
    
        // actualizamos

        // CON FILESYSTEM
        /*products.splice(productIndex, 1);
        product.pid = pid;
        products.push(product);
        await fs.promises.writeFile(path, JSON.stringify(products, null, 5));
       */

}

const deleteProduct = async (req, res) => {

    const pid = req.params.pid;

    try {
        // verifico el id valido de ese PRODUCTO
        const productDB = await productsModel.findById(pid);

        if (!productDB) {
            return res.status(404).json({
                ok: false,
                msg: `Cannot find the product with id ${pid}`
            });
        }

        // elimino en BD y devuelvo los datos actualizados
        await productsModel.findByIdAndDelete(pid);

        res.setHeader('Content-Type','application/json');
        res.status(200).json({
            message: "Product removed..",
        });

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }

    
    // CON FILESYSTEM
    /*
    let productIndex = await products.findIndex(e => e.pid == pid);
    if( productIndex == -1 ){

        return res.status(400).json({
            error: `Cannot find the product with id ${pid}`
        })

    }

    products.splice(productIndex, 1);
    await fs.promises.writeFile(path, JSON.stringify(products, null, 5));

    */

}

export {
    getProducts,
    getProductByPid,
    addProduct,
    updateProduct,
    deleteProduct
}