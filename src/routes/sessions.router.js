import { MiRouter } from "./router.js";
import { userLogin, userLogout, userRegister, userErrorLogin, userErrorRegister, currentUser, userGithub, userGitRegister } from "../handlers/sessions.handler.js";
import passport from "passport";
import jwt from 'jsonwebtoken';

export class SessionsRouter extends MiRouter{
    init(){ // como esta es una clase hija de Mirouter completamos el init acá
        //this.get('/github',passport.authenticate('github',{}), userGithub);

        //this.get('/callbackGithub',passport.authenticate('github',{failureRedirect:'/login'}), userGitRegister);

        //this.post('/register',['PUBLIC'],passport.authenticate('register',{failureRedirect:'/api/sessions/errorRegister', successRedirect:'/login'}), userRegister);
        this.post('/register', ['PUBLIC'], userRegister);

        this.get('/errorLogin', userErrorLogin);

        this.get('/errorRegister', userErrorRegister);

        //routerSessions.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), userLogin);
        this.post('/login', ['PUBLIC'], userLogin);
    

        this.get('/logout', ['PUBLIC'], userLogout);

        this.get('/current', ['PUBLIC'], currentUser);
    }
}
