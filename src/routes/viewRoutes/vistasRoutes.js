import { Router } from "express";
import { lecturaArchivo } from "../../utils/utils.js";
import { messagesModel } from '../../dao/models/messages.models.js';
import { productsModel } from '../../dao/models/products.models.js';
import { cartsModel } from '../../dao/models/carts.models.js';


const routervistas = Router();

// MIDLEWARES
const auth=(req, res, next)=>{
  if(!req.session.userLogged) return res.redirect('/login')    //return res.sendStatus(401);
  next();
}

const auth2=(req, res, next)=>{
  if(req.session.userLogged) return res.redirect('/')    //return res.sendStatus(401);
  next();
}

routervistas.get("/",auth, async(req, res) => {

  let productoDB;
    let pageActual = req.query.pagina | 1;
    let limitElements = req.query.limit | 5;
    let sortElements = req.query.order | 0;

    productoDB = await productsModel.paginate({},{page: pageActual, limit: limitElements, sort:{price: sortElements}});

        let {totalPages, hasPrevPages, hasNextPage, prevPage, nextPage} = productoDB;

  res.setHeader("Content-Type", "text/html");
  res.status(200).render("products", { 
    productoDB, totalPages, hasPrevPages, hasNextPage, prevPage, nextPage,
    nombreCompleto:req.session.userLogged.name+' '+req.session.userLogged.lastName,
    rol:req.session.userLogged.role
   });
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

routervistas.get("/products", async (req, res) => {  

    let productoDB;
    let pageActual = 1;

    if(req.query.pagina){
      pageActual = req.query.pagina;
    }

    let limitElements = req.query.limit | 4;
    let sortElements = req.query.order | 0;
    let filterElements = req.query.category;
    try {
        
      
        productoDB = await productsModel.paginate({},{page:pageActual, limit: limitElements, sort:{price: sortElements}});

        console.log(productoDB);
        let {totalPages, hasPrevPages, hasNextPage, prevPage, nextPage} = productoDB;
        
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("products", { 
          productoDB, totalPages, hasPrevPages, hasNextPage, prevPage, nextPage
        });


    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({
            status: "Error al obtener los datos de la DB"
        });
    }
});

routervistas.post("/products/detailProduct", async(req, res) => {  

  let {pid} = req.body; 

  let productDB = await productsModel.findById(pid);
  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  res.setHeader("Content-Type", "text/html");
  res.render("detailProduct", {productDB});
});

routervistas.post("/products/productAdded", async(req, res) => {  

  let {pid} = req.body; 
  /*console.log(pid);

  let productDB = await productsModel.findById(pid);
  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  */
  res.setHeader("Content-Type", "text/html");
  res.send(pid);
});

// CARRITO
routervistas.get("/cart/:cid", async(req, res) => {  

  let cid = req.params.cid; 

  try{
    let cartDB = await cartsModel.findById(cid)
                       .populate('products.pid');
    if( cartDB ){
      res.setHeader("Content-Type", "text/html");
      res.render("cart", {cartDB});
        
    }else{
        res.setHeader('Content-Type','application/json');
        res.sendStatus(400);
    }   
} catch (error) {
    console.log(error);
    res.sendStatus(500);
}
  
});

routervistas.get("/register", auth2, (req, res) => {  

  //LE INDICO QUE RENDERICE LA VISTA REGISTER
  res.setHeader("Content-Type", "text/html");
  res.render("register");
});

routervistas.get("/login",auth2, (req, res) => {  

  //LE INDICO QUE RENDERICE LA VISTA LOGIN
  res.setHeader("Content-Type", "text/html");
  res.render("login");
});
export { routervistas };