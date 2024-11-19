export interface Producto {
    id : number;
    nombre : string;
    descripcion : string;
    precio : number;
    imagen : string;
    cantidad ?: number;
    destacado : boolean;
}

export interface WebpayResponse {
    url: string;
    token: string;
}