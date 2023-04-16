import { existsSync } from "fs";
import { readFile, writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { config } from '../config/config.js';

export const creaHash = (password)=>{
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10))

}

export const esClaveValida = (password, user)=>{
  return bcrypt.compareSync(password, user.password);
}




//funcion de lectura de archivo, tomando como parametro el path del archivo
export async function lecturaArchivo(path) {
    try {
      if (existsSync(path)) {
        let leidoDeArchivo = await readFile(path, "utf8");
        //retorna una instancia de promesa
        leidoDeArchivo = JSON.parse(leidoDeArchivo);
        return leidoDeArchivo;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error al intentar leer archivo->", error);
    }
  }
  //funcion de escritura de archivo, tomando path del archivo y contenido a incluir
  export async function escrituraArchivo(path, contenidoAEscribir) {
    try {
      const escritoArchivo = await writeFile(path, contenidoAEscribir);
      //retorna una instancia de promesa
      return escritoArchivo;
    } catch (error) {
      console.log("error al intentar escribir archivo->", error);
    }
  }
  
  export async function deleteProductSocket(id) {
    let products = await lecturaArchivo("./src/products.json");
    console.log("tipo de dato del id-->",typeof id)
    console.log("el id: ", id)
    let productIndex = products.findIndex((product) => product.pid == id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products.splice(productIndex, 1);
      await escrituraArchivo("./src/products.json", JSON.stringify(products, null, 2));
      return "Message: Product deleted successfully";
    } else {
      return "Error: Product not found";
    }
  }
  
  export async function addProductSocket(objetoEmpty,code){
    
    let arayprueba = await lecturaArchivo("./src/products.json")
    let indexCodeRepetido = arayprueba.findIndex((p)=>p.code == code)
    //busco si encontro o no ya el codigo en el archivo
    if(indexCodeRepetido == -1){
      objetoEmpty.pid = uuidv4(),
      arayprueba.push(objetoEmpty)
      await escrituraArchivo("./src/products.json", JSON.stringify(arayprueba, null, 2));
      return "Message: Producto agregado correctamente!";
     
    }else{
      return `Producto con codigo ${code} ya cargado!`
    }
  }

  

  // CREA JWT
  export const creaJWT = (usuario)=>{
    return jwt.sign({usuario},config.SECRET,{expiresIn:'24h'});
  }
  
  // VALIDAR JWT
  export const validarJWT = (req, res, next)=>{
    // evalua si hay un token
    let token = '';
    if(req.headers.authorization){
      console.log('toma token desde header authorization');
      token=req.headers.authorization.split(' ')[1]
  }else{
      if(req.cookies['token']){
          console.log('token desde cookie')
          token=req.cookies['token'];
      }else{
          if(req.headers.token){
              console.log('token desde headers')
              token=req.headers.token;
          }else{
              if(req.query.token){
                  console.log('token desde query params')
                  token=req.query.token;
              }else{
                  return res.sendStatus(401);
              }
          }
      }
  }
    // verifica si el token es valido
    jwt.verify(token, config.SECRET, (error, credenciales)=>{
      if(error){
        res.sendStatus(401);
      }else{
        req.user=credenciales.usuario;
        next();
      }
    })

  }

  export const passportCall=(estrategia)=>{
    return async(req, res, next)=>{
        passport.authenticate(estrategia, (error, usuario, info)=>{
            if (error)return next(error);
            if(!usuario){
                if(!info){
                    return res.status(401).send('No autenticado');
                }else{
                  
                    return res.status(401).send({error:info.messages?info.messages:info.toString()})
                }
            }
            
            req.user=usuario;
            next();
        })(req, res, next)
    }
}