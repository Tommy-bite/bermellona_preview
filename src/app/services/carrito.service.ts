import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto, WebpayResponse } from '../interfaces/producto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = this.obtenerCarritoDeStorage();
  private carritoSubject = new BehaviorSubject<Producto[]>(this.carrito);

  carrito$ = this.carritoSubject.asObservable();
  csrfToken : any;

  constructor(private http : HttpClient, private cookieService: CookieService) {
    this.csrfToken = this.cookieService.get('csrftoken');
  }

  // Método para obtener el carrito del localStorage
  obtenerCarritoDeStorage(): Producto[] {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
  }

  // Método para guardar el carrito en el localStorage
  guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  agregarAlCarrito(producto: Producto) {
    this.carrito.push(producto);
    this.carritoSubject.next(this.carrito);
    this.guardarCarritoEnStorage(); // Guardar el carrito actualizado
  }

  quitarDelCarrito(producto: Producto) {
    this.carrito = this.carrito.filter(item => item.id !== producto.id);
    this.carritoSubject.next(this.carrito);
    this.guardarCarritoEnStorage(); // Guardar el carrito actualizado
  }

  productoEnCarrito(producto: Producto): boolean {
    return this.carrito.some(item => item.id === producto.id);
  }

  getCSRFTokenFromServer() {
    return this.http.get<{ csrftoken: string }>(`${environment.apiUrl}/csrf/`, {
      withCredentials: true // Importante para recibir la cookie CSRF
    });
  }
  
  iniciarPago(data: any): Observable<WebpayResponse> {
    // Lee el token de la cookie
    const csrfToken = this.cookieService.get('csrftoken');
  
    // Configura el encabezado con el token CSRF
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
    });
  
    // Realiza la solicitud POST
    return this.http.post<WebpayResponse>(
      `${environment.apiUrl}/webpay/iniciar-pago/`,
      data,
      {
        headers,
        withCredentials: true, // Importante para incluir cookies
      }
    );
  }
  

  confirmarPago(token: string): Observable<any> {
    // Leer el token CSRF de las cookies si es necesario
    const csrfToken = this.cookieService.get('csrftoken');
    console.log('CSRF Token:', this.csrfToken);


    // Configurar los encabezados con el token CSRF
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
    });

    // Realizar la solicitud PUT
    return this.http.put(
      `${environment.apiUrl}/webpay/confirmar-pago/${token}/`, // El token se pasa en la URL
      {}, // El cuerpo está vacío para esta solicitud
      { headers, withCredentials: true }
    );
  }
  
}
