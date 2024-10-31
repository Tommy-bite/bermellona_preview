import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.scss'
})
export class TiendaComponent {

}
