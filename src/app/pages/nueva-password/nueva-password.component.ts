import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { NgIf } from '@angular/common';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nueva-password',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RedesSocialesComponent, FormsModule, ReactiveFormsModule, NgIf, LoadingSpinnerComponent],
  templateUrl: './nueva-password.component.html',
  styleUrl: './nueva-password.component.scss'
})
export class NuevaPasswordComponent implements OnInit {
  formNuevaPassword: FormGroup;
  mensaje: string;
  tipoError: string;
  isLoading: boolean = false;

  token: string;
  uidb64: string;


  constructor(private fb: FormBuilder, private loginService: LoginService, private actRoute: ActivatedRoute, private route: Router) {
    this.mensaje = '';
    this.tipoError = '';
    this.token = '';
    this.uidb64 = '';
    this.formNuevaPassword = this.fb.group({
      new_password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.uidb64 = params.get('uid') || '';
    });

    if (!this.token || !this.uidb64) {
      this.route.navigateByUrl('/');
    } else {
    }
  }

  crearNuevaPassword() {
    this.isLoading = true;
    if (!this.token || !this.uidb64) {
      this.isLoading = false;
      this.route.navigateByUrl('/');
    } else {
      this.loginService.NewPasswordUser(this.formNuevaPassword.value.new_password, this.token, this.uidb64).subscribe({
        next: (resp: any) => {
          this.isLoading = false;

          // Inicializa el contador
          let remainingTime = 5;
          this.tipoError = 'exito';
          this.mensaje = `Se ha actualizado correctamente la contraseña de su cuenta. Redireccionando al login en ${remainingTime} segundos.`;

          // Configura un intervalo para actualizar el mensaje
          const interval = setInterval(() => {
            remainingTime--;
            this.mensaje = `Se ha actualizado correctamente la contraseña de su cuenta. Redireccionando al login en ${remainingTime} segundos.`;

            // Detén el intervalo y redirige cuando llegue a 0
            if (remainingTime === 0) {
              clearInterval(interval);
              this.route.navigateByUrl('/autenticacion');
            }
          }, 1000); // Actualiza cada segundo
        },
        error: (error: any) => {
          this.isLoading = false;

          // Inicializa el contador
          let remainingTime = 5;
          this.tipoError = 'error';
          this.mensaje = `El token no es válido. Redireccionando al login en ${remainingTime} segundos.`;

          // Configura un intervalo para actualizar el mensaje
          const interval = setInterval(() => {
            remainingTime--;
            this.mensaje = `El token no es válido. Redireccionando al login en ${remainingTime} segundos.`;

            // Detén el intervalo y redirige cuando llegue a 0
            if (remainingTime === 0) {
              clearInterval(interval);
              this.route.navigateByUrl('/autenticacion');
            }
          }, 1000); // Actualiza cada segundo
        }
      });
    }
  }

}
