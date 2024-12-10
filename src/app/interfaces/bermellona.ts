export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    cantidad: number;
    destacado: boolean;
    cantidadSeleccionada: number;
}

export interface Usuario {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superuser: boolean;
    is_active: boolean;
    profile: {
        id: number;
        celular: string;
        region: string;
        comuna: string;
        calle: string;
        usuario_id: number;
    }
}

export interface WebpayResponse {
    url: string;
    token: string;
}

export interface Soporte {
    id: number;
    nombre: string;
    correo_electronico: string;
    motivo: string;
    mensaje: string;
    estado: string;
    codigo : number;
}


export interface Venta {
    codigo: string;             // Código único de la venta
    fecha: Date;                // Fecha de la venta
    rut_cliente: string;        // RUT del cliente
    nombre_cliente: string;     // Nombre del cliente
    apellido_cliente: string;   // Apellido del cliente
    email_cliente: string;      // Correo electrónico del cliente
    opcion_entrega: string;     // Opción de entrega
    region: string;             // Región
    comuna: string;             // Comuna
    calle: string;              // Calle
    celular: string;            // Número de celular
    valor_total: number;        // Valor total de la venta
    estado: string;             // Estado de la venta
    metodo_pago : string;
    productos? : any[]
}
