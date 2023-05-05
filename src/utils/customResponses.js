const HTTP_STATUS={
    success200:{code:200, message:'Petición ejecutada correctamente'},
    success201:{code:201, message:'Se ha realizado el alta de manera correcta'},
    errorClient:{code:400, message:'Error de FrontEnd'},
    errorServer:{code:500, message:'Error interno en el servidor - Consulta al administrador'}
}

export default class MisRespuestas{
    static respuestaExitosa(res, dato){
        res.setHeader('Content-Type', 'application/json')
        return res.status(HTTP_STATUS.success200.code).json({
            mensaje:HTTP_STATUS.success200.message,
            dato
        })
    }

    static respuestaAltaExitosa(res, dato){
        res.setHeader('Content-Type', 'application/json')
        return res.status(HTTP_STATUS.success201.code).json({
            mensaje:HTTP_STATUS.success201.message,
            dato
        })
    }

    static errorCliente(res, error){
        res.setHeader('Content-Type', 'application/json')
        return res.status(HTTP_STATUS.errorClient.code).json({
            mensaje:HTTP_STATUS.errorClient.message,
            error
        })
    }

    static errorServer(res, error){
        res.setHeader('Content-Type', 'application/json')
        return res.status(HTTP_STATUS.errorServer.code).json({
            mensaje:HTTP_STATUS.errorServer.message,
            error
        })
    }


}