import crypto from 'crypto';

import { userModels } from '../dao/models/user.models.js';



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

    if(email === 'adminCoder@coder.com'){
        role = 'admin';
    }else{
        role = 'user';
    }
    
    userModels.create({
        name, lastName, email, 
        password:crypto.createHash('sha256','palabraSecreta').update(password).digest('base64'),
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

const userLogin = async (req, res) => {

    let {email, password}=req.body;

    try {
    
        if(!email || !password) {
            return res.status(404).json({
                ok: false,
                msg: `missed any value`
            });
        }

        let userLogged=await userModels.findOne({email:email, password:crypto.createHash('sha256','palabraSecreta').update(password).digest('base64')})
    
        if(!userLogged) return res.sendStatus(401)
        
        req.session.userLogged={
            name:userLogged.name, 
            lastName:userLogged.lastName, 
            email, 
            age:userLogged.age,
            role: userLogged.role
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



export {
    userRegister,
    userLogin,
    userLogout
}