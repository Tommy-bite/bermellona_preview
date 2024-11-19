import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [HeaderComponent, RedesSocialesComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

}
