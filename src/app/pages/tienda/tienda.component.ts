import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { Producto } from '../../interfaces/bermellona';
import { CarritoService } from '../../services/carrito.service';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { NgFor, NgIf } from '@angular/common';
import { AdministracionService } from '../../services/administracion.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent, MonedaChilenaPipe, NgIf, NgFor, FormsModule],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss'
})
export class TiendaComponent implements OnInit {
  productos!: Producto[]; // Todos los productos
  productosFiltrados!: Producto[]; // Productos filtrados por búsqueda, precio u orden
  productosPaginados!: Producto[]; // Productos para la página actual
  terminoBusqueda: string = ''; // Término de búsqueda
  precioSeleccionado: number = 50000; // Precio máximo por defecto
  ordenSeleccionado: string = ''; // Orden seleccionado
  paginaActual: number = 1;
  productosPorPagina: number = 12; // Número de productos por página

  constructor(
    private carritoService: CarritoService,
    private administracionService: AdministracionService
  ) {}

  ngOnInit(): void {
    this.administracionService.obtenerProductos().subscribe({
      next: (resp: Producto[]) => {
        this.productos = resp;
        this.filtrarProductos(); // Inicializar con los productos completos
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  filtrarProductos(): void {
    // Filtrar por término de búsqueda
    let productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );

    // Filtrar por precio
    productosFiltrados = productosFiltrados.filter(
      producto => producto.precio <= this.precioSeleccionado
    );

    // Ordenar los productos
    if (this.ordenSeleccionado === 'precioAsc') {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (this.ordenSeleccionado === 'precioDesc') {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    this.productosFiltrados = productosFiltrados;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.actualizarProductosPaginados();
  }

  actualizarProductosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    this.productosPaginados = this.productosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.actualizarProductosPaginados();
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados?.length / this.productosPorPagina);
  }

  agregarAlCarrito(producto: Producto): void {
    if (producto.cantidadSeleccionada > producto.cantidad) {
      alert('La cantidad seleccionada excede el stock disponible.');
      return;
    }
    this.carritoService.agregarAlCarrito(producto);
  }

  quitarDelCarrito(producto: Producto): void {
    if (producto) {
      this.carritoService.quitarDelCarrito(producto);
    }
  }

  enCarrito(producto: Producto): boolean {
    return this.carritoService.productoEnCarrito(producto);
  }
}
