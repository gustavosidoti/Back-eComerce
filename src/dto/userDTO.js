export class UserDto{
    constructor(usuario){
        this.name= usuario.name
        this.lastName=usuario.lastName
        this.email=usuario.email
        this.active=true
        this.role=usuario.role
        this.password=usuario.password
        this.age=usuario.age

    }
}

