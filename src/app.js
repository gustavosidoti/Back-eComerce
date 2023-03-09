const express=require('express');
const PORT=8080;
const engine  = require('express-handlebars').engine;
const Server = require('socket.io').Server;
const path=require('path');



// borrar esto
const fs = require ('fs');
const { v4: uuidv4 } = require('uuid');
const pathProducts = path.join(__dirname,'./Products.json');
const productsOn = fs.readFileSync(pathProducts, 'utf8');
const products = JSON.parse(productsOn);

const app=express();

// Motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Servir Contenido de la carpeta public 
app.use(express.static(path.join(__dirname,'public')));
//app.use(express.static(__dirname,'/public'));


// escucha del server
const serverhttp=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto PORT ${PORT}`);
});


// Comienzo de la configuración de sockets
const mensajes=[];

const io = new Server(serverhttp);
io.on('connection', (socket) => {

    //console.log(socket.handshake);

    console.log(`Se han conectado, socket id ${socket.id}`);

    socket.emit('hola',{
        emisor: 'servidor',
        mensaje: 'Hola desde el server',
        mensajes
    })

    socket.on('respuestaAlSaludo',(mensaje) => {
        console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

        socket.broadcast.emit('nuevoUsuario',mensaje.emisor)
    })

    socket.on('mensaje',(mensaje)=>{
        console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`)

        // todo el codigo que quiera...
        mensajes.push(mensaje);
        console.log(mensajes);

        //socket.broadcast.emit('nuevoMensaje',mensaje)
        io.emit('nuevoMensaje',mensaje)
    })

    socket.on('editProduct',(products) => {
        console.log(`Este mensaje es de ${products}`);

        socket.broadcast.emit('editProduct', products)
    })

})

serverhttp.on('error',(error)=>console.log(error));


const realTimeRouter = require('./routes/realtimeproducts.router');
const productsRouter = require('./routes/products.router');

// Rutas
app.use('/', require('./routes/views.router'));
/*app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home',{
        estilos:'styles.css'
    });
})
*/
app.get('/api/chat',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
})

app.post('/api/products', async(req, res) =>{

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

    await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, 5));
    //console.log(products);
    //io.broadcast.emit('editProduct',products)
    io.emit('editProduct', {
        products: products
    });
   
    res.setHeader('Content-Type','application/json');
    res.status(201).json({
        message: "Ok..",
        product: product
    });

});

/*app.use('/api/products', (req, res, next) => {
    req.serverSocket = io;
    next();
}, productsRouter);
*/

app.use('/api/carts', require('./routes/carts.router'));
//app.use('/api/realtimeproducts', require('./routes/realtimeproducts.router'));

app.use('/api/realtimeproducts', realTimeRouter);


