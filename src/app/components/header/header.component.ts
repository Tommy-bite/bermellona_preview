import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../interfaces/bermellona';
import { LoginGoogleService } from '../../services/loginGoogle.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, AsyncPipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit  {

  @Input() isFixedTop: boolean = false
  usuarioLogueado$ : Observable<boolean>;
  perfilUsuario$ : Observable<any>;  
  tooltips: bootstrap.Tooltip[] = [];
  carrito: Producto[] = [];
  es_admin : boolean = false;

  constructor(private authService: LoginService, private loginGoogleService : LoginGoogleService , private loginService : LoginService ,private carritoService: CarritoService, private router : Router) {
    this.usuarioLogueado$ = this.authService.isAuthenticated();
    this.perfilUsuario$ = this.authService.getUserProfile();
    this.perfilUsuario$.subscribe({
      next : (resp : any) => {
        this.es_admin = resp?.is_admin;
        console.log(this.es_admin);
      }
    })

  }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe((productos) => {
      this.carrito = productos;
    });
   
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach((dropdownToggleEl) => {
      new bootstrap.Dropdown(dropdownToggleEl);
    });
  }

  ngOnDestroy(): void {
    // Destruir todos los tooltips cuando el componente sea destruido
    this.tooltips.forEach(tooltip => tooltip.dispose());
  }

  cerrarTooltip() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (tooltip) {
        tooltip.hide(); 
      }
    });
  }

  cerrarSesion(){
    this.authService.logout();
    this.loginGoogleService.logout();
    this.router.navigateByUrl('/');
  }

}
