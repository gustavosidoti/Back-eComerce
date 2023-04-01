//import crypto from 'crypto';
import { creaHash, esClaveValida } from '../utils/utils.js';
import { userModels } from '../dao/models/user.models.js';



const userRegister = async (req, res) => {

    //let {name, lastName, email, password, age}=req.body;
    //let role;
    try {
    /*
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

    if(email === 'adminCoder@coder.com'){
        role = 'admin';
    }else{
        role = 'user';
    }
    
    userModels.create({
        name, lastName, email, 
        password: creaHash(password),
        age,
        role
    })
    */
    res.redirect('/login');

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Cannot connect with database"
        });
    }
}

const userLogin = async (req, res) => {
   // SE MUDO EL CÓDIGO A UN MIDDLEWARE QUE MANEJA EL LOGIN
   // let {email, password}=req.body;

    try {

    
       
        
        req.session.userLogged={
            name:req.user.name, 
            lastName:req.user.lastName, 
            email: req.user.email, 
            age:req.user.age,
            role: req.user.role
        }
    
        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        res.status(500).json({
            msg: "Error with the program"
        });
    }
}

const userLogout = async (req, res) => {

    req.session.destroy((err)=>{
        if(err){
            res.sendStatus(500);
        }else{
            res.redirect('/login');
        }
    });
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
    userErrorRegister
}