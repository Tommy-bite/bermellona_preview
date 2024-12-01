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
    ],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.scss'
})
export class SoporteComponent  implements OnInit{
  isLoading: boolean = false;
  soporte : Soporte[] = []

  displayedColumns: string[] = ['nombre', 'email', 'motivo', 'mensaje','estado','acciones'];
  dataSource = new MatTableDataSource<Soporte>();

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  readonly dialog = inject(MatDialog)

  constructor(private administracionService : AdministracionService, private notificacionesService : NotificacionesService){
  }

  ngOnInit(): void {
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
}
