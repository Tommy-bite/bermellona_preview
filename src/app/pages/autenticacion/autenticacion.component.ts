import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { passwordMatchValidator } from '../../functions/validador-password.function';
import { LoginService } from '../../services/login.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { HeaderComponent } from '../../components/header/header.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginGoogleService } from '../../services/loginGoogle.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-autenticacion',
  standalone: true,
  imports: [HeaderComponent, RedesSocialesComponent, FooterComponent, NgClass, RouterModule, NgIf, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent,],
  templateUrl: './autenticacion.component.html',
  styleUrl: './autenticacion.component.scss'
})
export class AutenticacionComponent {
  /* VARIABLES */
  public formRegistro: FormGroup;
  public formLogin: FormGroup;
  public seRegistroElUsuario: boolean = false;
  public isLoading: boolean = false;
  public mostrarMensaje: boolean = false;
  public mensaje: string = '';
  public mensajeConfirmacion: string = '';
  public statusConfirmacion: any;
  public showFormLogin: boolean = true;

  token : string | null;

  constructor(private fb: FormBuilder, private loginService: LoginService, private route: ActivatedRoute, private router : Router, private loginGoogleService : LoginGoogleService) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.formRegistro = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      acepto_terminos: ['', Validators.required],
      username: ''
    }, { validators: passwordMatchValidator() });

    this.token = localStorage?.getItem('token');
    if(this.token){
      this.router.navigateByUrl('/')
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.statusConfirmacion = params['status'];
      if (this.statusConfirmacion === 'success') {
        this.mensajeConfirmacion = '¡Tu cuenta ha sido activada exitosamente, ya puedes iniciar sesión!';
      } else if (this.statusConfirmacion === 'error') {
        this.mensajeConfirmacion = 'Hubo un problema al activar tu cuenta. Por favor, verifica el enlace o intenta de nuevo.';
      }
    });
  }

  /* MÉTODOS */
  iniciarSesion() {
    this.isLoading = true;
    if (this.formLogin.valid) {
      this.loginService.iniciarSesion(this.formLogin.value).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.isLoading = false;
          this.mostrarMensaje = false;
          this.router.navigateByUrl('/');
        },
        error: (error: any) => {
          this.isLoading = false;
  
          // Manejo del error
          if (error.error && error.error.non_field_errors) {
            this.mensaje = error.error.non_field_errors[0];
          } else if (error.status === 0) {
            // Error genérico para cuando no hay respuesta del servidor
            this.mensaje = 'No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde.';
          } else {
            // Otros errores
            this.mensaje = 'Ocurrió un error inesperado. Por favor, verifica tu conexión.';
          }
  
          this.mostrarMensaje = true;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  iniciarSesionConGoogle(){
    this.loginGoogleService.login();
  }
  

  registrar() {
    if (this.formRegistro.valid) {
      this.isLoading = true
      const email = this.formRegistro.get('email')?.value;
      this.formRegistro.patchValue({
        'username': email
      })

      this.loginService.registrarUsuario(this.formRegistro.value).subscribe({
        next: (resp: any) => {
          this.seRegistroElUsuario = true
          this.isLoading = false;
          this.mostrarMensaje = false;
        },
        error: (error: any) => {
          this.seRegistroElUsuario = false
          this.isLoading = false;
          if (error.error && error.error.email && Array.isArray(error.error.email)) {
            this.mensaje = error.error.email[0];
          } else {
            this.mensaje = 'Ha ocurrido un error. Inténtalo de nuevo.';
          }
          this.mostrarMensaje = true;
        }
      })
    } else {
      this.formRegistro.markAllAsTouched();
      this.formRegistro.updateValueAndValidity();
    }
  }

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

  toggleChangeOptionAutenticacion() {
    this.showFormLogin = !this.showFormLogin;
  }
}
