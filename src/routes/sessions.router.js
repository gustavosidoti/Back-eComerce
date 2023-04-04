import { Router } from "express";
import { userLogin, userLogout, userRegister, userErrorLogin, userErrorRegister, userGithub, userGitRegister } from "../handlers/sessions.handler.js";
import passport from "passport";

const routerSessions = Router();

routerSessions.get('/github',passport.authenticate('github',{}), userGithub);

routerSessions.get('/callbackGithub',passport.authenticate('github',{failureRedirect:'/login'}), userGitRegister);

routerSessions.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/errorRegister', successRedirect:'/login'}), userRegister);

routerSessions.get('/errorLogin', userErrorLogin);

routerSessions.get('/errorRegister', userErrorRegister);

routerSessions.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}), userLogin);

routerSessions.get('/logout', userLogout);

    

// exports
export {routerSessions};