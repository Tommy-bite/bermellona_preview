import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-pago-confirmado',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pago-confirmado.component.html',
  styleUrl: './pago-confirmado.component.scss'
})
export class PagoConfirmadoComponent {

  token_ws : any;

  constructor(private route: ActivatedRoute, private carritoService : CarritoService, private router : Router){
  }

  ngOnInit(): void {
    // Leer el parámetro de la URL
    this.route.queryParamMap.subscribe(queryParams => {
      this. token_ws= queryParams.get('token_ws');
      console.log('Token WS recibido:', this. token_ws);
      if(!this.token_ws){
        this.router.navigateByUrl('/');
      }
    });

    this.carritoService.confirmarPago(this.token_ws).subscribe({
      next : (resp : any) => {
        console.log(resp);
      },
      error : (error : any) => {
        console.log(error);
      }
    })
  }
}
