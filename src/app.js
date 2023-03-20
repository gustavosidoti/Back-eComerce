import express from "express";
import * as fs from 'fs';
import * as libreriaPath from 'path';
const __dirname = libreriaPath.resolve();
import { routerCart } from "./routes/carts.router.js";
import { routerProducts } from "./routes/products.router.js";
import { routervistas } from "./routes/viewRoutes/vistasRoutes.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import { lecturaArchivo,deleteProductSocket,addProductSocket } from "./utils/utils.js";
import { messagesModel } from "./dao/models/messages.models.js";
import { productsModel } from '../src/dao/models/products.models.js';
import { cartsModel } from '../src/dao/models/carts.models.js';


  // Carga de archivo de productos usar FILESYSTEM

console.log(libreriaPath.join(__dirname, '/src/products.json'));
const path = libreriaPath.join(__dirname, '/src/products.json');
const productsOn = fs.readFileSync(path, 'utf8');
const productsDB = JSON.parse(productsOn);


const app = express();

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

// Conexion a la BD
const conectar = async() => {
  try {
    await mongoose.connect('mongodb+srv://coderhouse:coderhouse@coderhouse.qltnizo.mongodb.net/ecommerce?retryWrites=true&w=majority');
    console.log('DB online');

        /*await productsModel.deleteMany({});
        let resultado=await productsModel.create(
          productsDB
         )
         console.log(resultado)

         await cartsModel.deleteMany({});
        */

  } catch (error) {
    console.log(`Fallo la conexión a la BD ${error}`);
  }

   
}

conectar();



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
    await messagesModel.create({ user: user, message: message });
    serverSocket.emit("messagesListUpdated");
  })
    

});

