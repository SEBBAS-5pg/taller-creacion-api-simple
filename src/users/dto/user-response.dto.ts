import { User } from "../interface/user.interface";

export class UserResponseDto {
    id: string;
    nombre: string;
    email: string;
    fecha_creacion: Date;

    constructor(user: User) {
        this.id = user.id;
        this.nombre = user.nombre;
        this.email = user.email;
        this.fecha_creacion = user.fecha_creacion;
    }
}