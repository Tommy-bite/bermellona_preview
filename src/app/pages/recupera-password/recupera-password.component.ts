import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';

@Component({
  selector: 'app-recupera-password',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent],
  templateUrl: './recupera-password.component.html',
  styleUrl: './recupera-password.component.scss'
})
export class RecuperaPasswordComponent {

}