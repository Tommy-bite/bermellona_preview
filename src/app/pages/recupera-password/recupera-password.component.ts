import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { NgIf } from '@angular/common';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-recupera-password',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent, FormsModule, ReactiveFormsModule, NgIf, LoadingSpinnerComponent],
  templateUrl: './recupera-password.component.html',
  styleUrl: './recupera-password.component.scss'
})
export class RecuperaPasswordComponent {

  formRecuperar : FormGroup;
  mensaje : string;
  tipoError : string;
  isLoading : boolean = false;

  constructor(private fb : FormBuilder, private loginService : LoginService){
    this.mensaje = '';
    this.tipoError = '';
    this.formRecuperar = this.fb.group({
      email : ['', [Validators.required, Validators.email]]
    })
  }

  recuperarPassword(){
    this.isLoading = true;
    this.loginService.recoveryPasswordUser(this.formRecuperar.value).subscribe({
      next : ( resp : any) => {
        this.mensaje = 'Gracias. Le hemos enviado un correo electrónico con las instrucciones para recuperar el acceso a su cuenta.';
        this.tipoError = 'exito';
        this.formRecuperar.reset();
        this.isLoading = false;
      },
      error : (error : any) => {
        if(error.error.email){
          this.mensaje = 'No se ha encontrado un usuario con el correo electrónico ingresado';
        }else{
          this.mensaje = 'Ha ocurrido un problema para recuperar su acceso a su cuenta. Intente nuevamente mas tarde.';
        }
        this.tipoError = 'error';
        this.isLoading = false;
      }
    })
  }

  

}
