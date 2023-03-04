const fs = require('fs');
const path=require('path');

// Carga de archivo de productos
// const pathProducts = './Products.json';
const pathProducts = path.join(__dirname,'../Products.json');
const productsOn = fs.readFileSync(pathProducts, 'utf8');
const products = JSON.parse(productsOn);

const getHomeProducts = async(req, res) =>{

    const limit = Number(req.query.limit) || 0;
    if(limit != 0){
        productsLimit = products.slice(0,limit);
        res.setHeader('Content-Type','application/json');
        await res.json(productsLimit);
    }else{
        res.render('home', {
            products: products,
            estilos:'style.css'
        });
    }
}

module.exports = {
    getHomeProducts
}