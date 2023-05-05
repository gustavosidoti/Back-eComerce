import { productsModel } from '../dao/models/products.models.js';
import { productService } from '../services/index.js';
import MisRespuestas from '../utils/customResponses.js';



const getProducts = async(req, res) =>{

    let productoDB;
    let pageActual = req.query.page||1;
    let limitElements = req.query.limit||5;
    let sortElements = req.query.order||0;
    let filterElements = req.query.category;
    try {
        
        
            productoDB = await productService.getProducts(filterElements, limitElements, pageActual,sortElements);
        
        MisRespuestas.respuestaExitosa(res,productoDB);

    } catch (error) {
        MisRespuestas.errorServer(res,error);
    }

};

const getProductByPid = async(req, res) =>{

    let pid = req.params.pid;
    try {

       let productDB = await productService.getProductByPid(pid);
    if( productDB ){
        MisRespuestas.respuestaExitosa(res,productDB)
    }else{
        MisRespuestas.errorCliente(res,error);
    }   
    } catch (error) {
        MisRespuestas.errorServer(res,error);
    }
    
};

const addProduct = async(req, res) =>{

    let product = req.body;
    try {
        if(!product.title || !product.description || !product.price || !product.status
            || !product.stock || !product.category || !product.thumnails || product.pid){
                MisRespuestas.errorCliente(res,error);
        }

        let productDB = await productService.getProductsSimple();
       
        if(productDB.length == 0){
            product.code = 1;
        }else{
            let lastProductCode = await productService.getLastProductCode();
            product.code = lastProductCode;
            
        }

        let productAdded = await productService.saveProduct(product);

        MisRespuestas.respuestaExitosa(res,productAdded);
    

    } catch (error) {
        
        MisRespuestas.errorServer(res,error);
    }
}

const updateProduct = async(req, res) =>{

    let pid = req.params.pid;

    try {
        // verifico el id valido de ese producto
        const productDB = await productService.getProductByPid(pid);

        if (!productDB) {
            MisRespuestas.errorCliente(res,error);
        }

        let product = req.body; 

        if(!product.title || !product.description || !product.code || !product.price || !product.status
        || !product.stock || !product.category || !product.thumnails || product.pid ){
            MisRespuestas.errorCliente(res,error);
        }

        // si pasó todo lo anterior actualizamos
        const productUpdated = await productService.updateProduct(pid, product);

        MisRespuestas.respuestaExitosa(res,productUpdated);

    } catch (error) {
        MisRespuestas.errorServer(res,error);
    }
}

const deleteProduct = async (req, res) => {

    const pid = req.params.pid;

    try {
        // verifico el id valido de ese PRODUCTO
        const productDB = await productService.getProductByPid(pid);

        if (!productDB) {
            MisRespuestas.errorCliente(res,error);
        }

        // elimino en BD y devuelvo los datos actualizados
        await productService.deleteProduct(pid);

        res.setHeader('Content-Type','application/json');
        res.status(200).json({
            message: "Product removed..",
        });

    } catch (error) {
        MisRespuestas.errorServer(res,error);
    }
}

export {
    getProducts,
    getProductByPid,
    addProduct,
    updateProduct,
    deleteProduct
}