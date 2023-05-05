import { MiRouter } from "../router.js";
import { productsModel } from '../../dao/models/products.models.js';
import { cartsModel } from '../../dao/models/carts.models.js';
import { rolesModel } from '../../dao/models/roles.models.js';
import { messageService } from "../../services/index.js";



export class VistasRouter extends MiRouter {

  init(){

    //this.get('/',['PUBLIC'],passportCall('jwt'),async(req,res)=>{
      this.get('/',['PUBLIC'],async(req,res)=>{
      let productoDB;
        let pageActual = req.query.page || 1;
        let limitElements = req.query.limit || 5;
        let sortElements = req.query.order || 0;
    
        productoDB = await productsModel.paginate({},{page: pageActual, limit: limitElements, sort:{price: sortElements}});
    
        let rolUsuario = await rolesModel.findOne({nombre:req.user.role})
    
            let {totalPages, hasPrevPages, hasNextPage, prevPage, nextPage} = productoDB;
    
      res.setHeader("Content-Type", "text/html");
      res.status(200).render("products", { 
        productoDB, totalPages, hasPrevPages, hasNextPage, prevPage, nextPage,
        nombreCompleto: req.user.name, rol: rolUsuario.nombre
       });
    });

    this.get("/login",['PUBLIC'],(req, res) => {  
    
      //LE INDICO QUE RENDERICE LA VISTA LOGIN
      res.setHeader("Content-Type", "text/html");
      res.render("login");
    });
    
    this.get("/register",['PUBLIC'], (req, res) => {  

      //LE INDICO QUE RENDERICE LA VISTA REGISTER
      res.setHeader("Content-Type", "text/html");
      res.render("register");
    });
    
    
    
    //routervistas.get("/datos",passport.authenticate('jwt',{session:false}),(req, res)=>{
      this.get('/datos',['ADMIN'],(req,res)=>{
      res.send(`Datos actualizados... hora actual: ${new Date().toUTCString()}`);
    });

      this.get("/chat",['USUARIO'], async (req, res) => {  

      let messages = await messageService.getMessage();
      res.render("chat", { messages });    
    });
  }
}

// MIDLEWARES

const autorizacion=(rol)=>{
  return (req, res, next)=>{
      console.log(req.user)

      if(req.user.role=='ADMIN') return next();
      if(req.user.role!=rol) return res.status(403).send('No tiene privilegios suficientes para acceder al recursooooooo');
      next();
  }
}

/*
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
  */
  /*console.log(pid);

  let productDB = await productsModel.findById(pid);
  //LE INDICO QUE RENDERICE LA VISTA REALTIMEPRODUCTS
  
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

*/


