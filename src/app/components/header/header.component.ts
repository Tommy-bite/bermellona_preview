import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, AsyncPipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit  {

  @Input() isFixedBottom: boolean = false
  usuarioLogueado$ : Observable<boolean>;
  perfilUsuario$ : Observable<any>;  
  tooltips: bootstrap.Tooltip[] = [];
  carrito: Producto[] = [];

  constructor(private authService: LoginService, private carritoService: CarritoService, private router : Router) {
    this.usuarioLogueado$ = this.authService.isAuthenticated();
    this.perfilUsuario$ = this.authService.getUserProfile();
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
    this.router.navigateByUrl('/');
  }

}
