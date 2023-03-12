import { Router } from "express";
import { lecturaArchivo } from "../../utils/utils.js";
import { messagesModel } from '../../dao/models/messages.models.js';


const routervistas = Router();
const archivoURL = "./src/products.json";

let arayprueba = await lecturaArchivo(archivoURL)
//console.log(arayprueba)


routervistas.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("home", { arayprueba });
});

//cuando el cliente va a la ruta /realtimeproducts 
routervistas.get("/realtimeproducts", (req, res) => {  

  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  res.setHeader("Content-Type", "text/html");
  res.render("realTimeProducts");
});

routervistas.get("/chat", async (req, res) => {  

  let messages = await messagesModel.find().lean();
  res.render("chat", { messages });

});


export { routervistas };