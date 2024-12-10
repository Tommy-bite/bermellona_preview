import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Producto } from '../../interfaces/bermellona';
import { NgIf, UpperCasePipe } from '@angular/common';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { AdministracionService } from '../../services/administracion.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { NotificacionesService } from '../../services/notificaciones.service';
import Notiflix from 'notiflix';
import { ClientesComponent } from './clientes/clientes.component';
import { SoporteComponent } from './soporte/soporte.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    HeaderComponent,
    RedesSocialesComponent,
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
    MonedaChilenaPipe,
    LoadingSpinnerComponent,
    ClientesComponent,
    SoporteComponent,
    RouterModule
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent implements OnInit {

  isLoading: boolean = false;

  displayedColumns: string[] = ['nombre', 'imagen', 'descripcion', 'destacado','cantidad', 'precio', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  readonly dialog = inject(MatDialog)

  constructor(private administracionService: AdministracionService, private notificacionesService: NotificacionesService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.administracionService.obtenerProductos().subscribe({
      next: (resp: Producto[]) => {
        this.dataSource.data = resp;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    })
  }

  renderizarTabla() {
    this.isLoading = true;
    this.administracionService.obtenerProductos().subscribe({
      next: (resp: Producto[]) => {
        this.dataSource.data = resp;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  crearProducto() {
    const dialogRef = this.dialog.open(DialogCrearProducto, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: { formData: FormData; isEdit: boolean }) => {
      if (result) {
        if (result.isEdit) {
          console.error('Error: el diálogo fue abierto para crear, pero se devolvió isEdit como true.');
          return;
        }
        this.administracionService.crearProducto(result.formData)
        .subscribe({
          next: (resp: any) => {
            this.renderizarTabla();
            this.notificacionesService.reporte('success', 'Éxito', 'Se ha creado correctamente el producto', 'OK');
          },
          error: (error: any) => {
            console.log(error);
            this.notificacionesService.reporte('failure', 'Error', 'No fue posible crear el producto, comuniquese con el administrador', 'OK');
          }
        });
      }
    });
  }

  editarProducto(producto: Producto) {
    const dialogRef = this.dialog.open(DialogCrearProducto, {
      width: '400px',
      data: producto, // Pasar el producto a editar
    });

    dialogRef.afterClosed().subscribe((result: { formData: FormData; isEdit: boolean }) => {
      if (result) {
        if (!result.isEdit) {
          console.error('Error: el diálogo fue abierto para editar, pero se devolvió isEdit como false.');
          return;
        }
        this.administracionService
          .actualizarProducto(producto.id, result.formData)
          .subscribe({
            next: (resp: any) => {
              this.renderizarTabla();
              this.notificacionesService.reporte('success', 'Éxito', 'Se ha actualizado correctamente el producto', 'OK');
            },
            error: (error: any) => {
              console.log(error);
              this.notificacionesService.reporte('failure', 'Error', 'No fue posible actualizar el producto, comuniquese con el administrador', 'OK');
            }
          });
      }
    });
  }

  eliminarProducto(id: number) {
    Notiflix.Confirm.show(
      '¿Eliminar producto?',
      'Haga clic en el botón si para eliminar',
      'Si',
      'No',
      () => {
        this.administracionService.eliminarProducto(id).subscribe({
          next: (resp: any) => {
            this.renderizarTabla();
            this.notificacionesService.reporte('success', 'Éxito', 'Se ha eliminado correctamente el producto', 'OK');
          },
          error: (error: any) => {
            console.log(error);
            this.notificacionesService.reporte('failure', 'Error', 'No fue posible eliminar el producto, comuniquese con el administrador', 'OK');
          }
        });
      },
      () => {
      }
    )

   
  }

}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'crear-producto.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCrearProducto {

  productoForm: FormGroup;
  imagenSeleccionada: File | null = null;
  esEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogCrearProducto>,
    @Inject(MAT_DIALOG_DATA) public data: Producto | null // Producto opcional
  ) {
    this.productoForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || ''],
      cantidad: [data?.cantidad || 0, [Validators.required, Validators.min(1)]],
      precio: [data?.precio || 0, [Validators.required, Validators.min(1)]],
      imagen: [null], // Imagen opcional
      destacado: [data?.destacado || false],
    });

    if (data) {
      this.esEdicion = true;
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      this.productoForm.patchValue({ imagen: file });
    }
  }

  guardarProducto(): void {
    if (this.productoForm.valid) {
      console.log(this.productoForm.value);
      const formData = new FormData();
      formData.append('nombre', this.productoForm.get('nombre')?.value);
      formData.append('descripcion', this.productoForm.get('descripcion')?.value);
      formData.append('cantidad', this.productoForm.get('cantidad')?.value.toString());
      formData.append('precio', this.productoForm.get('precio')?.value.toString());
      formData.append('destacado', this.productoForm.get('destacado')?.value);
      if (this.imagenSeleccionada) {
        formData.append('imagen', this.imagenSeleccionada);
      }

      // Cierra el diálogo y envía los datos
      this.dialogRef.close({ formData, isEdit: !!this.data });
    }
  }

}
