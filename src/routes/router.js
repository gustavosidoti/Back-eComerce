import { Router } from "express";
import jwt from 'jsonwebtoken';
import passport from "passport";
import { config } from '../config/config.js';

export class Mirouter {
    
    constructor(){
        this.router = Router();
        this.init();
    }

    init(){} // completar en la clase hija

    getRouter(){
        return this.router;
    }

    get(path, permisos, ...funciones){
        this.router.get(path, passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos), this.applyCallbacks(funciones))
    }

    post(path, permisos, ...funciones){
        this.router.post(path, passport.authenticate('jwt',{session: false}), this.misRespuestas, this.handlePolicies(permisos),this.applyCallbacks(funciones))
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback=>async(...params)=>{
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send('internal error');
            }
        })
    }

    misRespuestas(req, res, next){
        res.success = (respuesta)=>res.status(200).send({status:'ok', respuesta})
        res.success2 = (respuesta, datos)=>res.status(200).send({status:'OK', respuesta, datos})
        res.errorCliente = (error)=>res.status(400).send({status:'error cliente', error})
        res.errorAutenticacion = (error)=>res.status(401).send({status:'error autenticación', error})
        res.errorAutorizacion = (error)=>res.status(403).send({status:'error autorizacion', error})

        next()
    }

    handlePolicies(arrayPermisos){
        return(req, res, next)=>{
            if(arrayPermisos.includes('PUBLIC')) return next();

            let autHeader=req.headers.authorization;
            if(!autHeader) return res.errorAutenticacion('No esta autenticado');
            let token=autHeader.split(' ')[1]
            let contenidoToken=jwt.verify(token,config.SECRET,(err,decoder)=>{
                console.log('error');
                if(err) return false;
                return decoder
            })
            if(!contenidoToken) return res.errorAutenticacion('No esta autenticado');
            
            let usuario=contenidoToken.usuario
            console.log(usuario);
            if(!arrayPermisos.includes(usuario.role.toUpperCase())) return res.errorAutorizacion('No tiene privilegios suficientes para acceder al recurso')
            req.user=usuario;
            
            next();
        }
    }

}// fin de la clase Mirouter