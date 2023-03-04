const express=require('express');
const PORT=8080;
const engine  = require('express-handlebars').engine;
const Server = require('socket.io').Server;
const path=require('path');

// borrar esto
const fs = require ('fs');
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
app.use(express.static('./src/public/assets/js'));

const realTimeRouter = require('./routes/realtimeproducts.router');
// Rutas
app.use('/api/products', require('./routes/products.router'));
app.use('/api/carts', require('./routes/carts.router'));
//app.use('/api/realtimeproducts', require('./routes/realtimeproducts.router'));

app.use('/api/realtimeproducts', (req, res, next) => {
    req.serverSocket = io;
    next();
}, realTimeRouter)


app.use('/', require('./routes/views.router'));


const serverhttp=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto PORT ${PORT}`);
});

const io = new Server(serverhttp);
io.on('connection', (socket) => {

    //console.log(socket.handshake);

    console.log(`Se han conectado ${socket.id}`);
});

serverhttp.on('error',(error)=>console.log(error));