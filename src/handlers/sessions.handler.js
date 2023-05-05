//import crypto from 'crypto';
import { creaHash, creaJWT, esClaveValida } from '../utils/utils.js';
import MisRespuestas from '../utils/customResponses.js';
import { userService } from "../services/index.js";


const userRegister = async (req, res) => {

    
    let {name, lastName, email, password, age}=req.body;
    let role;
    try {
        
            if(!email || !password) {
                return MisRespuestas.errorCliente(res,error)
            }
        //let actualUser= await userModels.findOne({email:email})
        let actualUser= await userService.obtenerUsuarioPorEmail({email:email})
        
        if(actualUser) {
            return MisRespuestas.errorCliente(res,error)
        }
        if(email === 'adminCoder@coder.com' || email === 'gustavosidoti@gmail.com' ){
            role = '643a9a28c3cfc38957a37998'; // ADMIN
        }else{
            role = '643a9b1fc3cfc38957a37999'; // USUARIO
        }
        
       
        const userToCreate = {
            name, lastName, email, 
            password: creaHash(password),
            age,
            role
        }

        const userCreated = await userService.grabaUsuario(userToCreate);
        
        MisRespuestas.respuestaExitosa(res,userCreated);
    
        } catch (error) {
            console.log(error);
            MisRespuestas.errorServer(res, error);
        }
}

const userGithub = async (req, res) => {

    
}

const userGitRegister = async(req, res) => {
   

}

const currentUser = async(req, res) => {
    
    try {
        let actualUser = await userService.obtenerUsuarioFiltrado({email: req.user.email})
                                
        MisRespuestas.respuestaExitosa(res,actualUser);
    } catch (error) {
        MisRespuestas.errorServer(res, error);
    }
 
}

const userLogin = async (req, res) => {
   // SE MUDO EL CÓDIGO A UN MIDDLEWARE QUE MANEJA EL LOGIN
   let {email,password} = req.body;
   try {
        
    if(!email || !password) return MisRespuestas.errorCliente(res,error);

    let userLogged= await userService.obtenerUsuarioPorEmail({email:email});
    
    if(!userLogged) return MisRespuestas.errorCliente(res,error);

    if(!esClaveValida(password, userLogged )) return MisRespuestas.errorCliente(res,error);

    
    userLogged={
        name:userLogged.name, 
        lastName:userLogged.lastName, 
        email, 
        age:userLogged.age,
        role:userLogged.role.nombre
    }
    console.log(userLogged);
    let token= await creaJWT(userLogged);


    res.cookie('token',token,{maxAge:1000*60*120, httpOnly:true})
    .cookie('cookieConHttpOnly',token,{maxAge:1000*60*120, httpOnly:true})
    .cookie('cookieSinHttpOnly',token,{maxAge:1000*60*120})
    
    MisRespuestas.respuestaExitosa(res,token);
    //.cookie('cookieSinHttpOnly',token,{maxAge:1000*60*120}).success2('Login OK',token)
    
    
    } catch (error) {
        console.log(error);
        MisRespuestas.errorServer(res, error);
    }

   
}

const userLogout = async (req, res) => {

    res.redirect('/login');
}

const userErrorLogin = (req, res)=>{
    res.send('Error Login');
};

const userErrorRegister = (req, res)=>{
    res.send('Error Register');
};



export {
    userRegister,
    userLogin,
    userLogout,
    userErrorLogin,
    userErrorRegister,
    userGithub,
    userGitRegister,
    currentUser
}