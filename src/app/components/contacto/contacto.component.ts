import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificacionesService } from '../../services/notificaciones.service';
import { AdministracionService } from '../../services/administracion.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {

  formularioContacto : FormGroup;

  constructor(private fb : FormBuilder,private notificacionesService : NotificacionesService, private administracionService : AdministracionService){
    this.formularioContacto = this.fb.group({
      nombre : ['', Validators.required],
      correo_electronico : ['', Validators.required],
      motivo : ['', Validators.required],
      mensaje : ['',Validators.required],
      estado : 'pendiente'
    })
  }

  guardar(){
    if(this.formularioContacto.valid){
      this.notificacionesService.showloading('Enviando Consulta...');
      this.administracionService.guardarConsulta(this.formularioContacto.value).subscribe({
        next : (resp : any) => {
          this.formularioContacto.reset();
            this.notificacionesService.removeLoading();
        },
        error : (error : any) => {
          this.notificacionesService.removeLoading();
        }
      })
    }else{
    }
  }
}
