import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Provider } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { CarritoService } from '../../services/carrito.service';
import { ProductosService } from '../../services/productos.service';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, MonedaChilenaPipe, RouterModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {

  productos !: Producto[];

  constructor(private carritoService: CarritoService, private productosService : ProductosService) {
  }

  ngOnInit(): void {
    this.productosService.obtenerProductosDestacados().subscribe({
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
