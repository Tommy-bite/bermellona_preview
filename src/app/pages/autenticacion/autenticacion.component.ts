import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../functions/validador-password.function';
import { LoginService } from '../../services/login.service';
import { nanoid } from 'nanoid'

@Component({
  selector: 'app-autenticacion',
  standalone: true,
  imports: [ HeaderComponent, RedesSocialesComponent, FooterComponent, NgClass, RouterModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './autenticacion.component.html',
  styleUrl: './autenticacion.component.scss'
})
export class AutenticacionComponent {

  /* VARIABLES */
  public formRegistro: FormGroup;
  public seRegistroElUsuario : boolean = true;

  constructor(private fb: FormBuilder, private loginService : LoginService) {
    this.formRegistro = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      acepto_terminos: ['', Validators.required],
      username : ''
    }, { validators: passwordMatchValidator() });
  }

  /* MÉTODOS */
  registrar(){
    if(this.formRegistro.valid){
      const username = nanoid();
      console.log(username);
      this.formRegistro.patchValue({
        'username' : username
      })

      this.loginService.registrarUsuario(this.formRegistro.value).subscribe({
        next : (resp: any) => {
          this.seRegistroElUsuario = true
          alert('Se ha registraedo el usuario correctamente!')
        },
        error : (error : any) => {
          this.seRegistroElUsuario = false
          console.error('error al registrar el usuario');
        }
      })

    }else{
      this.formRegistro.markAllAsTouched();
      this.formRegistro.updateValueAndValidity();
    }
  }


  // Configuraciones para mostar y ocultrar contraseñas
  showPasswordLogin = false;
  showPassword = false;
  showRePassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleRePassword() {
    this.showRePassword = !this.showRePassword;
  }

  togglePasswordLogin() {
    this.showPasswordLogin = !this.showPasswordLogin;
  }

}
