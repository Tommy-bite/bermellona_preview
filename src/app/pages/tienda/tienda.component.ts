import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { Producto } from '../../interfaces/producto';
import { CarritoService } from '../../services/carrito.service';
import { ProductosService } from '../../services/productos.service';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { NgFor, NgIf } from '@angular/common';
import { AdministracionService } from '../../services/administracion.service';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent, MonedaChilenaPipe, NgIf, NgFor],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss'
})
export class TiendaComponent {
  productos !: Producto[];
  precioSeleccionado: number = 1000;

  constructor(private carritoService: CarritoService, private productosService : ProductosService, private administracionService : AdministracionService) {
  }

  ngOnInit(): void {
    this.administracionService.obtenerProductos().subscribe({
      next: (resp: Producto[]) => {
        this.productos = resp;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  agregarAlCarrito(producto: Producto) {
    if (producto) {
      this.carritoService.agregarAlCarrito(producto);
    }
  }

  quitarDelCarrito(producto: Producto) {
    if (producto) {
      this.carritoService.quitarDelCarrito(producto);
    }
  }

  enCarrito(producto: Producto): boolean {
    return this.carritoService.productoEnCarrito(producto);
  }
}
