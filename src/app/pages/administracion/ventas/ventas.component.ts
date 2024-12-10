import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdministracionService } from '../../../services/administracion.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { Venta } from '../../../interfaces/bermellona';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MonedaChilenaPipe } from '../../../pipes/moneda-chilena.pipe';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,  
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginator,
    MonedaChilenaPipe,
    FormsModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent {
  isLoading: boolean = false;
  ventas : Venta[] = []
  ventaSeleccionada: any = null;
  nuevoEstado: string = '';
  estados: string[] = ['Pendiente', 'Aprobado', 'Disponible para retiro','En preparación', 'En despacho', 'Entregado'];
  numeroEnvio: string = '';
  despachador: string = '';

  displayedColumns: string[] = ['codigo', 'fecha', 'rut_cliente', 'nombre_cliente','apellido_cliente','email_cliente', 'opcion_entrega', 'region', 'comuna', 'calle', 'celular', 'valor_total','metodo_pago', 'productos','estado', 'acciones'];
  dataSource = new MatTableDataSource<Venta>();

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(private administracionService : AdministracionService, private notificacionesService : NotificacionesService){
  }

  ngOnInit(): void {
   this.cargarVentas()
  }

  cargarVentas(){
    this.administracionService.obtenerVentas().subscribe({
      next : (resp : Venta[]) => {
        this.ventas = resp;
        console.log(this.ventas);
        this.dataSource.data = this.ventas;
      }
    })
  }

  onEstadoChange() {
    if (this.nuevoEstado !== 'En despacho') {
      // Limpiar campos adicionales si no es "En despacho"
      this.numeroEnvio = '';
      this.despachador = '';
    }
  }

  abrirModal(venta: any) {
    this.ventaSeleccionada = venta;
    this.nuevoEstado = venta.estado;
    this.numeroEnvio = ''; // Reiniciar campos adicionales
    this.despachador = '';

    // Abre el modal con Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('estadoModal')!, {
      backdrop: 'static',
    });
    modal.show();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  actualizarEstado() {
    if (!this.ventaSeleccionada || !this.nuevoEstado) return;
    this.notificacionesService.showloading('Actualizando venta..')
    // Datos a enviar
    const datos = {
      estado: this.nuevoEstado,
      numero_envio: this.nuevoEstado === 'En despacho' ? this.numeroEnvio : null,
      despachador: this.nuevoEstado === 'En despacho' ? this.despachador : null,
    };

    this.administracionService.actualizarEstado(this.ventaSeleccionada.id, datos).subscribe(() => {
      this.cargarVentas();
      console.log(datos);
      this.notificacionesService.success('Se ha actualizado el estado exitosamente!');
      this.notificacionesService.removeLoading();
      const modal = bootstrap.Modal.getInstance(document.getElementById('estadoModal')!)!;
      modal.hide();
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  abrirModalProductos(venta: any) {
    this.ventaSeleccionada = venta;

    // Abre el modal con Bootstrap
    const modalProductos = new bootstrap.Modal(document.getElementById('productosModal')!, {
      backdrop: 'static',
    });
    modalProductos.show();
  }
}
