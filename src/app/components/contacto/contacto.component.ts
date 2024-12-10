import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificacionesService } from '../../services/notificaciones.service';
import { AdministracionService } from '../../services/administracion.service';
import { nanoid } from 'nanoid'

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
      codigo : '',
      nombre : ['', Validators.required],
      correo_electronico : ['', Validators.required],
      motivo : ['', Validators.required],
      mensaje : ['',Validators.required],
      estado : ''
    })
  }

  guardar(){
    if(this.formularioContacto.valid){

      this.formularioContacto.patchValue({
        codigo :  nanoid(),
        estado : 'pendiente'
      })

      this.notificacionesService.showloading('Enviando Consulta...');
      this.administracionService.guardarConsulta(this.formularioContacto.value).subscribe({
        next : (resp : any) => {
          this.formularioContacto.reset();
          this.notificacionesService.removeLoading();
          this.notificacionesService.success('Hemos recibido tus datos correctamente..:)')
        },
        error : (error : any) => {
          this.notificacionesService.removeLoading();
          this.notificacionesService.failure('Ha ocurrido un problema, intente mas tarde..')
        }
      })
    }else{
    }
  }
}
