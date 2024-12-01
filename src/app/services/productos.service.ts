import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/bermellona';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http : HttpClient) { }

  obtenerProductosDestacados() : Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos/destacados`);
  }
}
