import { Router } from "express";
import jwt from 'jsonwebtoken';
import passport from "passport";
import { config } from '../config/config.js';

export class MiRouter {
    
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){} // completar en la clase hija

    getRouter(){
        return this.router;
    }

    get(path, permisos, ...funciones){
        //this.router.get(path, passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos), this.applyCallbacks(funciones))
        this.router.get(path, (path === '/login' || path === '/register')?[]:passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos), this.applyCallbacks(funciones))
    }

    post(path, permisos, ...funciones){
        this.router.post(path, (path === '/login' || path === '/register')?[]:passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos), this.applyCallbacks(funciones))
    }

    put(path, permisos, ...funciones){
        this.router.put(path, passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos), this.applyCallbacks(funciones))
    }

    delete(path, permisos, ...funciones){
        this.router.delete(path, passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos), this.applyCallbacks(funciones))
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback=>async(...params)=>{
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send('internal errorrrrrrr');
            }
        })
    }

    misRespuestas(req, res, next){
        res.success = (respuesta)=>res.status(200).send({status:'ok', respuesta})
        res.success2 = (respuesta, datos)=>res.status(200).send({status:'OK', respuesta, datos})
        res.errorCliente = (error)=>res.status(400).send({status:'error cliente', error})
        res.errorAutenticacion = (error)=>res.status(401).send({status:'error autenticación', error})
        res.errorAutorizacion = (error)=>res.status(403).send({status:'error autorizacion', error})

        next();
    }

    handlePolicies(arrayPermisos){
        
        return(req, res, next)=>{
            if(arrayPermisos.includes('PUBLIC')) return next();
            
           let usuario = req.user;
            
            if(!arrayPermisos.includes(usuario.role.toUpperCase())) return res.errorAutorizacion('No tiene privilegios suficientes para acceder al recurso')
            
            next();
        }
    }

}// fin de la clase Mirouter