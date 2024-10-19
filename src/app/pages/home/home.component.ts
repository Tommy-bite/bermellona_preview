import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { SobreNosotrosComponent } from '../../components/sobre-nosotros/sobre-nosotros.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CarouselComponent, RedesSocialesComponent, SobreNosotrosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
