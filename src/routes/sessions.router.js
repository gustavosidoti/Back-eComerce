import { MiRouter } from "./router.js";
import { userLogin, userLogout, userRegister, userErrorLogin, userErrorRegister, currentUser, userGithub, userGitRegister } from "../handlers/sessions.handler.js";
import passport from "passport";
import jwt from 'jsonwebtoken';

export class SessionsRouter extends MiRouter{
    init(){ // como esta es una clase hija de Mirouter completamos el init acá
        
        this.post('/register', ['PUBLIC'], userRegister);

        this.get('/errorLogin', userErrorLogin);

        this.get('/errorRegister', userErrorRegister);

        this.post('/login', ['PUBLIC'], userLogin);
    
        this.get('/logout', ['PUBLIC'], userLogout);

        this.get('/current', ['PUBLIC'], currentUser);
    }
}
