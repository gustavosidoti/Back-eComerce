import passport from 'passport';
import local from 'passport-local';
import { creaHash, esClaveValida } from '../utils/utils.js';
import { userModels } from '../dao/models/user.models.js';

export const inicializaEstrategia = ()=>{
/*
    passport.use('github', new github.Strategy({
        clientID:'Iv1.cef6323d9460de58',
        clientSecret: '6bdd0717b05069145648bbff6284d417d4af873c',
        callbackURL : 'http://localhost:3000/api/sessions/callbackGithub'
    },async(accessToken, refreshToken, profile, done)=>{

        try {
            console.log(profile);

            let nombre=profile._json.name;
            let email=profile._json.email;
    
            let usuario=await usuarioModelo.findOne({email:email});
            if(!usuario){
                let usuarioNuevo={
                    nombre,
                    email, 
                    github:true,
                    githubProfile:profile._json
                }
                usuario=await usuarioModelo.create(usuarioNuevo);
            }else{
                let actualizaUsuario={
                    github:true,
                    githubProfile:profile._json
                }
    
                await usuarioModelo.updateOne({email:email},actualizaUsuario);
            }
    
            done(null, usuario)
                
        } catch (error) {
            done(error)            
        }

        
    }))

*/
    passport.use('register', new local.Strategy({usernameField:'email', passReqToCallback:true}, async(req, username, password, done)=>{
                                                                        // me permite utilizar la request en el callback
        try {
            let {name, lastName, age}=req.body;

            if(!username || !password) return done(null, false);
        
            let actualUser=await userModels.findOne({email:username});
            
            if(actualUser) return done(null, false);
            
            let userCreated = await userModels.create({
                name, lastName, email, 
                password: creaHash(password),
                age,
                role
            })

            return done(null, userCreated);
                
        } catch (error) {
            done(error);            
        }

    
    }))


    passport.use('login', new local.Strategy({usernameField:'email'}, async(username, password, done)=>{
        
     try {
        
         if(!username || !password) return done(null, false)
 
         let userLogged= await userModels.findOne({email:username});
         if(!userLogged) return done(null, false);
 
         if(!esClaveValida(password, userLogged )) return done(null,false);
        console.log('paso por aca');
        //console.log(userLogged);
        return done(null, userLogged);
     } catch (error) {
        return done(error);
     }
    }));

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    });

    passport.deserializeUser(async(id, done)=>{
        let userLogged = await userModels.findOne({_id:id});
        done(null, userLogged);
    });
}