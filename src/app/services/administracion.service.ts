import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Producto, Soporte, Usuario, Venta } from '../interfaces/bermellona';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

  constructor(private http : HttpClient) {
  }

  /*CRUD PRODUCTOS */
  obtenerProductos() : Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`);
  }

  crearProducto(producto : FormData){
    return this.http.post(`${environment.apiUrl}/productos/`, producto);
  }

  actualizarProducto(id: number, producto: FormData): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/productos/${id}/`, producto);
  }

  eliminarProducto(id : number){
    return this.http.delete(`${environment.apiUrl}/productos/${id}/`);
  }

  /* CRUD USUARIOS */
  obtenerUsuarios() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}/lista-usuarios`);
  }

  habilitaOrDesactivaUsuario(id : number, action : string){
    return this.http.post(`${environment.apiUrl}/toggle-user-status/`, { id: id, action: action } );
  }

  recuperarPasswordUsuarioConEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/password-reset-request/`, { email });
  }

  /* CRUD SOPORTE*/
  guardarConsulta(data :any){
    return this.http.post(`${environment.apiUrl}/soporte/`, data);
  }

  obtenerSoporte() : Observable<Soporte[]> {
    return this.http.get<Soporte[]>(`${environment.apiUrl}/soporte`);
  }

  /* CRUD VENTAS */
  obtenerVentas() : Observable<Venta[]>{
    return this.http.get<Venta[]>(`${environment.apiUrl}/ventas`);
  }

  actualizarEstado(id: number, data: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/ventas/${id}/`,  data );
  }

  obtenerVentasCliente(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/ventas/cliente/${id}/`);
  }

  actualizarEstadoSoporte(id : any, data : any){
    return this.http.patch(`${environment.apiUrl}/soporte/${id}/actualizar-estado/`, data);
  }
  
  
}
