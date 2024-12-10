import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import {MatTabsModule} from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Usuario, Venta } from '../../interfaces/bermellona';
import { AdministracionService } from '../../services/administracion.service';
import { MonedaChilenaPipe } from "../../pipes/moneda-chilena.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent, MatTabsModule, MonedaChilenaPipe, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  usuarioLogueado$: Observable<boolean>;
  perfilUsuario$: Observable<any>;
  perfilUsuario : any;
  perfilDatos  : any;;

  ventas: Venta[] = []

  constructor(private authService : LoginService, private administracionService : AdministracionService){
    this.usuarioLogueado$ = this.authService.isAuthenticated();
    this.perfilUsuario$ = this.authService.getUserProfile();
    this.perfilUsuario$.subscribe({
      next : (resp : Usuario) => {
        this.perfilUsuario = resp;
      }
    })
  }

  ngOnInit(): void {
    this.authService.fetchUserProfile();
    this.authService.obtenerPerfilUsuario(this.perfilUsuario.id).subscribe({
      next : (resp : any) => {
       this.perfilDatos = resp;
      }
    })

    this.administracionService.obtenerVentasCliente(this.perfilUsuario.id).subscribe({
      next : (resp : Venta[]) => {
        this.ventas = resp;
      }
    })
  }

}
