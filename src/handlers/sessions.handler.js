//import crypto from 'crypto';
import { creaHash, creaJWT, esClaveValida } from '../utils/utils.js';
import { userModels } from '../dao/models/user.models.js';
import { MiRouter } from "../routes/router.js";


const userRegister = async (req, res) => {

    
    let {name, lastName, email, password, age}=req.body;
    let role;
    try {
        
            if(!email || !password) {
                return res.status(404).json({
                    ok: false,
                    msg: `missed any value`
                });
            }
        let actualUser= await userModels.findOne({email:email})
        
        if(actualUser) {
            return res.status(404).json({
                ok: false,
                msg: `the user ${email} already exist`
            });
        }
        if(email === 'adminCoder@coder.com' || email === 'gustavosidoti@gmail.com' ){
            role = '643a9a28c3cfc38957a37998'; // ADMIN
        }else{
            role = '643a9b1fc3cfc38957a37999';
        }
        
        userModels.create({
            name, lastName, email, 
            password: creaHash(password),
            age,
            role
        })
        
        res.redirect('/login');
    
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            res.status(500).json({
                msg: "Cannot connect with database"
            });
        }
}

const userGithub = async (req, res) => {

    
}

const userGitRegister = async(req, res) => {
   

}

const currentUser = async(req, res) => {
    console.log(req.user.email);
    try {
        let actualUser = await userModels.findOne({email: req.user.email})
                                    .populate('role');
        res.success2('Usuario Logueado', actualUser);
    } catch (error) {
        console.log(error);
        res.errorCliente(error);
    }
 
}

const userLogin = async (req, res) => {
   // SE MUDO EL CÓDIGO A UN MIDDLEWARE QUE MANEJA EL LOGIN
   let {email,password} = req.body;
   try {
        
    if(!email || !password) return res.sendStatus(400);

    let userLogged= await userModels.findOne({email:email});
    
    if(!userLogged) return res.sendStatus(400);

    if(!esClaveValida(password, userLogged )) return res.sendStatus(400);

    
    userLogged={
        name:userLogged.name, 
        lastName:userLogged.lastName, 
        email, 
        age:userLogged.age,
        role:userLogged.role.nombre
    }
    console.log(userLogged);
    let token= await creaJWT(userLogged);

    let respuesta = new MiRouter();

    res.cookie('token',token,{maxAge:1000*60*120, httpOnly:true})
    .cookie('cookieConHttpOnly',token,{maxAge:1000*60*120, httpOnly:true})
    .cookie('cookieSinHttpOnly',token,{maxAge:1000*60*120}).success2('Login OK',token)
    
    
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
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