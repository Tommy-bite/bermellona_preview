import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-pago-confirmado',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './pago-confirmado.component.html',
  styleUrl: './pago-confirmado.component.scss'
})
export class PagoConfirmadoComponent {

  token_ws: string | null = null;
  estadoPago: string = ''
  transaccion : any;
  metodo_pago : any;

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private router: Router,
    private notificacionesService : NotificacionesService
  ) { }

  ngOnInit(): void {
    this.notificacionesService.showloading('Procesando compra...')
    // Leer el parámetro de la URL
    this.route.queryParamMap.subscribe(queryParams => {
      this.token_ws = queryParams.get('token_ws');
      console.log('Token WS recibido:', this.token_ws);
    });

    if (!this.token_ws) {
      this.notificacionesService.removeLoading()
      this.estadoPago = 'aprobada';

      const carrito = this.carritoService.obtenerCarritoDeStorage(); 
      console.log(carrito);
      if (!carrito || carrito.length === 0) {
        console.error('El carrito está vacío o no es válido:', carrito);
        this.notificacionesService.removeLoading()
        this.router.navigate(['/carrito', 'rechazada']);
        this.estadoPago = '';
        return;
      }

      const datosFormulario = localStorage.getItem('ventaFormulario');
      const datosVenta = datosFormulario ? JSON.parse(datosFormulario) : null;

      const usuario = localStorage.getItem('userProfile');
      const usuarioObjeto = usuario ? JSON.parse(usuario) : null;
      let idUsuario = usuarioObjeto?.id;

      const today = new Date();

      if(datosVenta){
        const venta = {
          ...datosVenta,
          descuento: 0, // Si existe descuento, incluirlo
          valor_total: carrito.reduce((total: number, item: any) => total + item.precio * item.cantidad, 0),
          estado : 'pendiente',
          fecha: today,
          usuario : idUsuario,
          productos: carrito.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad
          })),
          tokenWebpay : this.token_ws || ''
        };

        console.log('venta', venta);
        this.carritoService.guardarVenta(venta).subscribe({
          next : (resp : any) => {
            this.estadoPago = 'aprobada'
            this.notificacionesService.removeLoading();
            this.handleTransaction('aprobada', this.transaccion);
            this.carritoService.limpiarCarritoYFormulario();

          },
          error : (error : any) => {
            this.notificacionesService.removeLoading();
            this.estadoPago = 'rechazada'
            this.handleTransaction('rechazada', this.transaccion);

          }
        })
      }

      return;
    }

    // Confirmar el estado del pago
    this.carritoService.confirmarPago(this.token_ws).subscribe({
      next: (resp: any) => {
        console.log('Respuesta de confirmar pago:', resp);
        this.transaccion = resp;
        this.estadoPago = '';
        if (resp.data.status === "AUTHORIZED") {
          const carrito = this.carritoService.obtenerCarritoDeStorage(); 
          console.log(carrito);
          if (!carrito || carrito.length === 0) {
            console.error('El carrito está vacío o no es válido:', carrito);
            this.notificacionesService.removeLoading()
            this.router.navigate(['/carrito', 'rechazada']);
            this.estadoPago = '';
            return;
          }

          const datosFormulario = localStorage.getItem('ventaFormulario');
          const datosVenta = datosFormulario ? JSON.parse(datosFormulario) : null;

          const usuario = localStorage.getItem('userProfile');
          const usuarioObjeto = usuario ? JSON.parse(usuario) : null;
          let idUsuario = usuarioObjeto?.id;

          if(datosVenta){
            const venta = {
              ...datosVenta,
              descuento: 0, // Si existe descuento, incluirlo
              valor_total: carrito.reduce((total: number, item: any) => total + item.precio * item.cantidad, 0),
              estado : 'pendiente',
              fecha: resp.data.transaction_date,
              usuario : idUsuario,
              productos: carrito.map((item: any) => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad
              })),
              tokenWebpay : this.token_ws
            };

            console.log('venta', venta);
            this.carritoService.guardarVenta(venta).subscribe({
              next : (resp : any) => {
                this.estadoPago = 'aprobada'
                this.notificacionesService.removeLoading();
                this.handleTransaction('aprobada', this.transaccion);
                this.carritoService.limpiarCarritoYFormulario();

              },
              error : (error : any) => {
                this.notificacionesService.removeLoading();
                this.estadoPago = 'rechazada'
                this.handleTransaction('rechazada', this.transaccion);

              }
            })
          }
        } else if (resp.data.status === "FAILED") {
          // Pago rechazado

          this.estadoPago = 'rechazada';
          this.handleTransaction('rechazada',this.transaccion);
          this.handlePaymentError('Compra rechazada');
          this.notificacionesService.removeLoading();
        } else {
          // Estado desconocido
          this.estadoPago = 'rechazada';
        }
      },
      error: (error: any) => {
        console.error('Error al confirmar pago:', error);
        this.handlePaymentError('Error de red o servidor al confirmar el pago.');
      }
    });
  }

  private handleTransaction(estado: string, data: any): void {
    console.log('Datos recibidos en handleTransaction:',  this.transaccion);
    if(!data){
    }else{
      const transaccion = {
        token: this.token_ws,
        fecha_transaccion: data.data.transaction_date,
        estado,
        monto: data.data.amount,
      };
  
      this.carritoService.guardarTransaccionWebpay(transaccion).subscribe({
        next: (resp: any) => {
          console.log('Transacción guardada:', resp);
        },
        error: (error: any) => {
          console.error('Error al guardar transacción:', error);
        }
      });
    }
   
  }

  private handlePaymentError(message: string): void {
    console.error(message);
  }

  volverAlComercio() {
    if(this.estadoPago == 'aprobada'){
      this.router.navigate(['/tienda']);
    }else{
      this.router.navigate(['/carrito', 'rechazada']);
    }
  }
}