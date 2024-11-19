import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // private apiUrl = 'http://127.0.0.1:8000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private userProfileSubject = new BehaviorSubject<any>(this.getUserProfileFromStorage());

  constructor(private http: HttpClient) { }

  // Método para verificar si hay un token válido en localStorage
  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Aquí podrías implementar más lógica para verificar la validez del token
  }

  // Observable para cambios de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Observable para cambios en el perfil de usuario
  getUserProfile(): Observable<any> {
    return this.userProfileSubject.asObservable();
  }

  // Método para iniciar sesión
  iniciarSesion(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login/`, data).pipe(
      tap((response: any) => {
        if (response.access) {
          localStorage.setItem('token', response.access);
          localStorage.setItem('refresh', response.refresh);
          this.isAuthenticatedSubject.next(true); // Notifica que el usuario está autenticado
          this.fetchUserProfile(); // Obtiene y guarda el perfil de usuario
        }
      })
    );
  }

  // Método para registrar un nuevo usuario
  registrarUsuario(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/registro/`, data);
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('userProfile');
    this.isAuthenticatedSubject.next(false); // Notifica que el usuario ya no está autenticado
    this.userProfileSubject.next(null); // Limpia el perfil de usuario en memoria
  }

  // Método para obtener el token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para obtener el token de actualización
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  // Método para obtener y guardar el perfil de usuario
  fetchUserProfile(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
    this.http.get(`${environment.apiUrl}/user-profile/`, { headers }).subscribe((profile: any) => {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      this.userProfileSubject.next(profile); // Actualiza el perfil en memoria
    });
  }

  // Método para recuperar el perfil del usuario almacenado en localStorage
  private getUserProfileFromStorage(): any {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  }

  // Método para recuperar la password del usuario
  recoveryPasswordUser(email : string) {
    return this.http.post(`${environment.apiUrl}/password-reset/`, email);
  }

  NewPasswordUser(new_password : string, token : string, uidb64 : string) {
    return this.http.post(`${environment.apiUrl}/password-reset-confirm/`, { new_password, token, uidb64 });
  }


}
