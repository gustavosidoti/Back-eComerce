import { Router } from "express";
import { userLogin, userLogout, userRegister } from "../handlers/sessions.handler.js";
const routerSessions = Router();



routerSessions.post('/register', userRegister);

routerSessions.post('/login', userLogin);

routerSessions.get('/logout', userLogout);

    

// exports
export {routerSessions};