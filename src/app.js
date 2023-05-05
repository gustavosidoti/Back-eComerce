import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
//import sessions from 'express-session';
//import MongoStore from "connect-mongo";
import passport from "passport";
import { inicializaEstrategias } from "./config/passport.js";

import { CartsRouter } from "./routes/carts.router.js";
import { ProductsRouter } from "./routes/products.router.js";
import { SessionsRouter } from "./routes/sessions.router.js";
import { VistasRouter } from './routes/viewRoutes/vistasRoutes.js';
import { lecturaArchivo,deleteProductSocket,addProductSocket } from "./utils/utils.js";
//import { messagesModel } from "./dao/models/messages.models.js";
import { config } from './config/config.js';
import { messageService } from "./services/index.js";




const PORT = config.app.PORT;

const app = express();
const sessionRouter = new SessionsRouter();
const vistasRouter = new VistasRouter();
const productsRouter = new ProductsRouter();
const cartRouter = new CartsRouter();

app.engine("handlebars", engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
inicializaEstrategias();
app.use(passport.initialize());


app.use(express.static("./src/public"));
//app.use(passport.session());

// RUTAS
//le indico que todo lo que vaya a / sea renderizado por el router de vistas que llama a la vista home para que muestre el contenido
app.use("/", vistasRouter.getRouter());
/*app.get("/login",(req, res) => {  
    
  //LE INDICO QUE RENDERICE LA VISTA LOGIN
  res.setHeader("Content-Type", "text/html");
  res.render("login");
});
*/
//app.post('/api/sessions/login', userLogin);
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());



const serverhttp = app.listen(PORT, (err) => {
  if (err) {
    throw new Error("Error");
  } else {
    console.log(`Example app listening on port ${PORT}!`);
  }
});

// Conexion a la BD
/*
const conectar = async() => {
  try {
    await mongoose.connect(config.database.MONGOURL);
    console.log('DB online');

  } catch (error) {
    console.log(`Fallo la conexión a la BD ${error}`);
  }

   
}

conectar();
*/
serverhttp.on('error',(error)=>console.log(error));


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

   socket.on("newMessage", async ({ user, message }) => {
    await messageService.saveMessage({ user: user, message: message });
    serverSocket.emit("messagesListUpdated");
  })
    

});


