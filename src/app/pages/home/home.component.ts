import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { SobreNosotrosComponent } from '../../components/sobre-nosotros/sobre-nosotros.component';
import { ProductosComponent } from '../../components/productos/productos.component';
import { ContactoComponent } from '../../components/contacto/contacto.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginService } from '../../services/login.service';
import { LoginGoogleService } from '../../services/loginGoogle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CarouselComponent, RedesSocialesComponent, SobreNosotrosComponent, ProductosComponent, ContactoComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private loginService : LoginService , private loginGoogleService : LoginGoogleService){
  }

  ngOnInit(): void {
    const profile = this.loginGoogleService.getProfile();

    if (profile) {
      const { email, name } = profile;
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');

      // Registrar o verificar el usuario en el backend
      this.loginService.checkOrRegisterUser(email, firstName, lastName).subscribe(response => {
        if (response) {
        }
      });
    } else {
      console.log('El usuario no está autenticado o falta el perfil.');
    }
  }

}
