import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { MonedaChilenaPipe } from '../../../pipes/moneda-chilena.pipe';
import { Usuario } from '../../../interfaces/bermellona';
import { MatDialog } from '@angular/material/dialog';
import { AdministracionService } from '../../../services/administracion.service';
import { Confirm } from 'notiflix';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    UpperCasePipe,
    CommonModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  isLoading: boolean = false;
  usuarios : Usuario[] = []

  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'contacto','cliente','administrador',  'activo','acciones'];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  readonly dialog = inject(MatDialog)

  constructor(private administracionService : AdministracionService, private notificacionesService : NotificacionesService){
  }

  ngOnInit(): void {
   this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.administracionService.obtenerUsuarios().subscribe({
      next : (resp : Usuario[]) => {
        this.usuarios = resp;
        console.log(resp);
        this.dataSource.data = this.usuarios;
      },error : (error : any) => {
        console.log(error);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  toggleEstadosUuario(id : any, action : string){
    Confirm.show(
      '¿Desea cambiar el estado?',
      'Clic en "Si" para cambiar el estado al usuario' ,
      'Si',
      'No',
      () => {
        this.notificacionesService.showloading('Actualizando estado...')
        this.administracionService.habilitaOrDesactivaUsuario(id, action).subscribe({
          next : (resp : any) => {
            this.notificacionesService.removeLoading()
            this.cargarUsuarios();
            if(action == 'activar'){
              this.notificacionesService.success('Se ha habilitado al usuario correctamente')
            }else{
              this.notificacionesService.success('Se ha deshabilitado al usuario correctamente')
            }
          },
          error : (error : any) => {
            this.notificacionesService.removeLoading()
            this.notificacionesService.failure('Error al completar la operación, intente mas tarde.')
            console.log(error);
          }
        })
      },
      () => {
      }
    )
  }

  restaurarPassword(email : string){
    Confirm.show(
      '¿Restaurar contraseña del usuario?',
      'Se enviara un correo de restauración' ,
      'Si',
      'No',
      () => {
        this.notificacionesService.showloading('Enviando correo...')
        this.administracionService.recuperarPasswordUsuarioConEmail(email).subscribe({
          next : (resp : any) => {
            this.notificacionesService.removeLoading()
            this.cargarUsuarios();
            this.notificacionesService.success('Se ha enviado un correo de restauración al usuario')
          },
          error : (error : any) => {
            this.notificacionesService.failure('Error al completar la operación, intente mas tarde.')
            console.log(error);
            this.notificacionesService.removeLoading()
          }
        })
      },
      () => {
      }
    )
  }

  chatearWhatsapp(celular: string): void {
    if (!celular) {
      console.error("El número de celular no puede estar vacío");
      return;
    }
  
    // Reemplaza espacios, guiones o caracteres no válidos
    const numeroLimpio = celular.replace(/\D/g, '');
  
    // Asegúrate de que el número tenga el formato correcto
    if (numeroLimpio.length < 10) {
      console.error("El número de celular no es válido");
      return;
    }
  
    // Construir la URL para abrir el chat en WhatsApp
    const whatsappURL = `https://wa.me/${numeroLimpio}`;
  
    // Abrir en una nueva pestaña
    window.open(whatsappURL, '_blank');
  }
  
}
