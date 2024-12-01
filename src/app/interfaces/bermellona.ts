export interface Producto {
    id : number;
    nombre : string;
    descripcion : string;
    precio : number;
    imagen : string;
    cantidad : number;
    destacado : boolean;
    cantidadSeleccionada : number;
}

export interface Usuario {
    id : number;
    username : string;
    email : string;
    first_name : string;
    last_name : string;
    is_superuser : boolean;
    is_active : boolean;
    profile : {
        id : number;
        celular : string;
        region : string;
        comuna : string;
        calle : string;
        usuario_id : number;
    }
}

export interface WebpayResponse {
    url: string;
    token: string;
}

export interface Soporte {
    id : number;
    nombre : string;
    correo_electronico : string;
    motivo : string;
    mensaje : string;
    estado : string;
}