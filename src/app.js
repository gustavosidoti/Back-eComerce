const path=require('path');
const express=require('express');
const engine  = require('express-handlebars').engine;
const Server = require('socket.io').Server;

const PORT=8080;

const app=express();

// borrar esto
const fs = require ('fs');
const pathProducts = path.join(__dirname,'./Products.json');
const productsOn = fs.readFileSync(pathProducts, 'utf8');
const products = JSON.parse(productsOn);


// Motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'./views'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Servir Contenido de la carpeta public 
app.use(express.static(path.join(__dirname,'./src/public')));


app.use('/', (req, res) =>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
});


const serverHttp=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto PORT ${PORT}`);
});

const serverSockets = new Server(serverHttp);
    serverSockets.on('connection', (socket)=>{

    console.log(socket.handshake);

    console.log(`Se han conectado, socket id ${socket.id}`)
})

serverHttp.on('error',(error)=>console.log(error));