import express from "express";

import { routerCart } from "./routes/carts.router.js";
import { routerProducts } from "./routes/products.router.js";
import { routervistas } from "./routes/viewRoutes/vistasRoutes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { lecturaArchivo,deleteProductSocket,addProductSocket } from "./utils/utils.js";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


// RUTAS
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCart);

//le indico que todo lo que vaya a / sea renderizado por el router de vistas que llama a la vista home para que muestre el contenido
app.use("/", routervistas);





const serverhttp = app.listen(8081, (err) => {
  if (err) {
    throw new Error("Error");
  } else {
    console.log("Example app listening on port 8081!");
  }
});

const mensajes=[];

//exporto mi servidor websobket
export const serverSocket = new Server(serverhttp);

//establezco una nueva connection
serverSocket.on("connection", async (socket) => {
  //cuando se conecta un nuevo cliente lo saludo y emito el listado de productos
  //console.log("New client connected", socket.handshake.headers.referer);
  console.log("New client connected", socket.handshake.headers.referer+" id:"+socket.id);

  
  //si se trata de una conexion a realtime products
  if(socket.handshake.headers.referer.includes("/realtimeproducts")){

    let arayprueba = await lecturaArchivo("./src/products.json")
    socket.emit("products",arayprueba) 
  }

  if(socket.handshake.headers.referer.includes("/api/chat")){

    socket.emit('hola',{
        emisor: 'servidor',
        mensaje: 'Hola desde el server',
        mensajes
    })
  }


  socket.on("deleteProduct", async (id) => {
    let response = await deleteProductSocket(id);
    let arayprueba = await lecturaArchivo("./src/products.json")
    socket.emit("deleteProductRes", response,arayprueba);
  });

   socket.on("addProduct", async (data) => {
    let response = await addProductSocket(data);
    let arayprueba = await lecturaArchivo("./src/products.json")
    socket.emit("addProductRes", response,arayprueba);
  }); 

   // Mensajes del chat

   socket.on('respuestaAlSaludo',(mensaje) => {
    console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`);

    socket.broadcast.emit('nuevoUsuario',mensaje.emisor)
   });

    socket.on('mensaje',(mensaje)=>{
    console.log(`${mensaje.emisor} dice ${mensaje.mensaje}`)

    // todo el codigo que quiera...
    mensajes.push(mensaje);
    console.log(mensajes);

    //socket.broadcast.emit('nuevoMensaje',mensaje)
    io.emit('nuevoMensaje',mensaje)
})

});

app.get('/api/chat',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.render('chat');
});