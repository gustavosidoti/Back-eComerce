import { UserDto } from "../dto/userDto.js";


export class UserService{
    constructor(dao){
        this.dao=dao
    }

    async getUsuarios(){
        return await this.dao.get()
    }

    async obtenerUsuarioPorEmail(email){
        let usuario= await this.dao.getBy(email)
        
        return usuario
    }

    async obtenerUsuarioFiltrado(email){
        let usuario= await this.dao.getBy(email)
        let usuarioFiltrado = {
            name: usuario.name,
            email:usuario.email,
            rol:usuario.role.nombre
        }
        
        return usuarioFiltrado
    }


    async grabaUsuario(usuario){
        return await this.dao.save(new UserDto(usuario))
    }

}

