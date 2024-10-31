import { CurrencyPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';



@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CurrencyPipe, NgFor],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  productos = [
    { nombre: 'Aros', descripcion: 'Bonitos aros para lucir este verano', precio: 25000, imagen: '/image9.jpg' },
    { nombre: 'Aros', descripcion: 'Bonitos aros para lucir este verano', precio: 25000, imagen: '/image6.jpg' },
    { nombre: 'Aros', descripcion: 'Bonitos aros para lucir este verano', precio: 25000, imagen: '/image5.jpg' },
    { nombre: 'Aros', descripcion: 'Bonitos aros para lucir este verano', precio: 25000, imagen: '/image4.jpg' },
    { nombre: 'Aros', descripcion: 'Bonitos aros para lucir este verano', precio: 25000, imagen: '/image7.jpg' },
    { nombre: 'Aros', descripcion: 'Bonitos aros para lucir este verano', precio: 25000, imagen: '/image8.jpg' },
  ];
}
