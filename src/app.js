/* -------------------------------------------------------------------------- */
/*                       Desafío N° 3 Servidores con express                  */
/* -------------------------------------------------------------------------- */

const express = require('express');
const fs = require ('fs');
const app = express();
const port = '8080';

// Carga de archivo
const productsOn = fs.readFileSync('./Products.json', 'utf8');
const products = JSON.parse(productsOn);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) =>{
    res.send('Servidor express corriendo');
})

app.get('/contacto', (req, res) =>{

    const Nombre = req.query.nombre;

    if(Nombre){
        console.log(req.query.nombre);
        res.setHeader('Content-Type','application/json');
        res.send(`Hola ${Nombre}`);
    }

    
})

app.get('/products', async(req, res) =>{

    const limit = Number(req.query.limit) || 0;
    if(limit != 0){
        productsLimit = products.slice(0,limit);
        res.setHeader('Content-Type','application/json');
        await res.json(productsLimit);
    }else{
        res.setHeader('Content-Type','application/json');
        await res.json(products);
    }
})

app.get('/products/:id', async(req, res) =>{

    let id = req.params.id;

    let product = await products.find(e => e.id == id);
    if( product ){
        res.setHeader('Content-Type','application/json');
        res.json(product);
    }else{
        res.json({
            error: `Cannot find the product with id ${id}`
        })
    }

    
    
})

app.get('*', (req, res) =>{
    res.send('Page not found');
})



app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});