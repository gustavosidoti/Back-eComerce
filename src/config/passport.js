import passport from 'passport';
import passportJWT from 'passport-jwt';
import { config } from './config.js';

const extraerToken=(req)=>{
    let token=null;

    if(req.cookies.token) {
        console.log("leyó desde passport la cookie")   
        token = req.cookies.token;
    }
    return token;
    // CODIGO que sirve para mostrarnos cómo puede venir el token
     /*
    if(req.headers.authorization){
        console.log('toma token desde header authorization, via PASSPORT');
        token=req.headers.authorization.split(' ')[1]
    }else{
        if(req.cookies['token']){
            console.log('token desde cookie, via PASSPORT')
            token=req.cookies['token'];
        }else{
            if(req.headers.token){
                console.log('token desde headers, via PASSPORT')
                token=req.headers.token;
            }else{
                if(req.query.token){
                    console.log('token desde query params, via PASSPORT')
                    token=req.query.token;
                }
            }
        }
    }

    return token;
    */
}

export const inicializaEstrategias=()=>{

    passport.use('jwt',new passportJWT.Strategy(
        {
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extraerToken]),
            secretOrKey: config.SECRET
        },
        (contenidoToken, done)=>{
            try {
                // SI QUEREMOS BLOQUEAR UN USUARIO
                /*if(contenidoToken.usuario.lastName=='Santos'){
                    done(null, false, {messages:'El usuario Santos se encuentra temporalmente inhabilitado'})
                }*/
                done(null, contenidoToken.usuario)
            } catch (error) {
                done(error)
            }
        }
    ))

    passport.use('current',new passportJWT.Strategy(
        {
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extraerToken]),
            secretOrKey: config.SECRET
        },
        (contenidoToken, done)=>{
            try {
                // SI QUEREMOS BLOQUEAR UN USUARIO
                /*if(contenidoToken.usuario.lastName=='Santos'){
                    done(null, false, {messages:'El usuario Santos se encuentra temporalmente inhabilitado'})
                }*/

                done(null, contenidoToken.usuario)
            } catch (error) {
                console.log('error desde current')
                done(error)
            }
        }
    ))

} // fin inicializaEstrategias()