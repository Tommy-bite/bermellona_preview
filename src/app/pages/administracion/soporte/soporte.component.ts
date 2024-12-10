import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdministracionService } from '../../../services/administracion.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Soporte } from '../../../interfaces/bermellona';
import { MatButtonModule } from '@angular/material/button';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { DialogSoporteComponent } from './dialog-soporte.component';
import { Dialog } from '@angular/cdk/dialog';
@Component({
  selector: 'app-soporte',
  standalone: true,
    imports: [
      CommonModule,  
      UpperCasePipe, 
      MatTableModule,
      MatPaginator,
      MatButtonModule,
      MatSortModule,
      FormsModule
    ],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.scss'
})
export class SoporteComponent  implements OnInit{
  isLoading: boolean = false;
  soporte : Soporte[] = []
  soporteSeleccionado: Soporte | null = null;
  nuevoEstado: string = 'Resuelto';
  mensajeResolucion: string = '';

  displayedColumns: string[] = ['nombre', 'email', 'motivo', 'mensaje','estado','acciones'];
  dataSource = new MatTableDataSource<Soporte>();

  private dialog = inject(Dialog);

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(private administracionService : AdministracionService, private notificacionesService : NotificacionesService){
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
   this.cargarSoportes();
  }

  cargarSoportes(){
    this.administracionService.obtenerSoporte().subscribe({
      next : (resp : Soporte[]) => {
        this.soporte = resp;
        this.dataSource.data = this.soporte;
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // abrirModal(soporte: Soporte) {
  //   const dialogRef = this.dialog.open(DialogSoporteComponent, {
  //     data: {
  //       nombre: soporte.nombre,
  //       motivo: soporte.motivo,
  //       mensaje: soporte.mensaje,
  //       estado: 'Resuelto',
  //       mensajeResolucion: '',
  //     },
  //   });

  //   dialogRef.closed.subscribe((result : any) => {
  //     if (result) {
  //       this.actualizarEstado(soporte.id, result);
  //     }
  //   });
  // }

  actualizarEstado(id: number, datos: any) {
    this.isLoading = true;
    this.administracionService.actualizarEstadoSoporte(id, datos).subscribe({
      next: () => {
        this.notificacionesService.success('Estado actualizado correctamente.');
        this.cargarSoportes();
      },
      error: () => {
        this.notificacionesService.failure('Hubo un error al actualizar el estado.');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

}
