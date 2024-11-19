import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';

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

}
