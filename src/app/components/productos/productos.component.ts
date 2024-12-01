import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Provider } from '@angular/core';
import { Producto } from '../../interfaces/bermellona';
import { CarritoService } from '../../services/carrito.service';
import { ProductosService } from '../../services/productos.service';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import {  RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, MonedaChilenaPipe, RouterModule, FormsModule ,NgClass],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {

  productos !: Producto[];
  imagenSeleccionada: string | null = null;
  

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
    if (producto.cantidadSeleccionada > producto.cantidad) {
      alert('La cantidad seleccionada excede el stock disponible.');
      return;
    }
    this.carritoService.agregarAlCarrito(producto);
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
