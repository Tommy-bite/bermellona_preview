import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { HeaderComponent } from '../../components/header/header.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Usuario, WebpayResponse } from '../../interfaces/bermellona';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { nanoid } from 'nanoid';

const regionesYcomunas = [
  {
    "regiones": [
      {
        "region": "Arica y Parinacota",
        "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
      },
      {
        "region": "Tarapacá",
        "comunas": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
      },
      {
        "region": "Antofagasta",
        "comunas": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
      },
      {
        "region": "Atacama",
        "comunas": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
      },
      {
        "region": "Coquimbo",
        "comunas": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
      },
      {
        "region": "Valparaiso",
        "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
      },
      {
        "region": "Libertador Gral. Bernardo O’Higgins",
        "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
      },
      {
        "region": "Maule",
        "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
      },
      {
        "region": "Región de Ñuble",
        "comunas": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
      },
      {
        "region": "Biobío",
        "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
      },
      {
        "region": "Araucanía",
        "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
      },
      {
        "region": "Ríos",
        "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
      },
      {
        "region": "Lagos",
        "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
      },
      {
        "region": "Aisén",
        "comunas": ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
      },
      {
        "region": "Magallanes y de la Antártica Chilena",
        "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
      },
      {
        "region": "Santiago",
        "comunas": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
      }
    ]
  }
]

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [HeaderComponent, RedesSocialesComponent, NgFor, NgIf, CurrencyPipe, RouterModule, MonedaChilenaPipe, LoadingSpinnerComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];  // Inicializa el carrito como un array vacío
  isLoading: boolean = false;
  opcionEntrega: string = '';
  regionSeleccionada: string = '';
  comunaSeleccionada: string = '';
  comunasFiltradas: string[] = [];
  costoEnvio: number = 0;
  formaDePago: string = '';
  regiones = regionesYcomunas[0].regiones;
  totalAPagar: number = 0;

  usuarioLogueado$: Observable<boolean>;
  perfilUsuario$: Observable<any>;

  formularioVenta: FormGroup;
  perfilUsuario: any = '';
  perfilDatos: any;

  estadoPago: string | null = null;

  constructor(private carritoService: CarritoService, private route: ActivatedRoute, private authService: LoginService, private fb: FormBuilder, private router: Router) {
    this.usuarioLogueado$ = this.authService.isAuthenticated();
    this.perfilUsuario$ = this.authService.getUserProfile();
    this.formularioVenta = this.fb.group({
      rut_cliente: ['', Validators.required],
      nombre_cliente: ['', Validators.required],
      apellido_cliente: ['', Validators.required],
      email_cliente: ['',[Validators.required, Validators.email]],
      opcion_entrega: ['', Validators.required],
      celular: ['', Validators.required],
      region: [''],
      comuna: [''],
      calle: [''],
      forma_pago: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.estadoPago = params.get('estado'); // Obtén el valor del segmento de ruta
    });


    this.perfilUsuario$.subscribe({
      next: (resp: Usuario) => {
        this.perfilUsuario = resp;
      }
    })
    this.authService.fetchUserProfile();

    if (this.perfilUsuario) {
      this.authService.obtenerPerfilUsuario(this.perfilUsuario.id).subscribe({
        next: (resp: any) => {
          this.perfilDatos = resp;
          console.log('datos', this.perfilDatos);
          this.formularioVenta.patchValue({
            email_cliente: this.perfilDatos.email,
            nombre_cliente: this.perfilDatos.first_name,
            apellido_cliente: this.perfilDatos.last_name,
          })
        }
      })
    }




    this.carritoService.carrito$.subscribe((productos) => {
      this.carrito = productos || [];  // Asegúrate de que carrito no sea undefined
    });

    // Captura el token de la URL
    const token_ws = this.route.snapshot.queryParamMap.get('token_ws');

    if (token_ws) {
      this.carritoService.confirmarPago(token_ws).subscribe(
        response => {
          console.log('Pago confirmado:', response);
          // Muestra un mensaje de éxito o redirige al usuario
        },
        error => {
          console.error('Error al confirmar el pago:', error);
        }
      );
    }
  }



  quitarDelCarrito(producto: any) {
    this.carritoService.quitarDelCarrito(producto);  // Elimina el producto del carrito
  }


  calcularTotal(): number {
    const subtotal = this.carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0); // Calcula el subtotal sumando precio * cantidad por cada producto
    this.totalAPagar = subtotal;
    return subtotal
  }


  calcularCantidadTotal(): number {
    return this.carrito.reduce((total, producto) => {
      return total + producto.cantidad;
    }, 0);  // Calcula el total de cantidad de productos en el carrito
  }

  // Método para ir a la página de pago (puedes redirigir a otra página o implementar lógica aquí)
  irAPagar(): void {
    if (this.formularioVenta.valid) {
      this.isLoading = true;
      const datosUsuario = this.formularioVenta.value;
      localStorage.setItem('ventaFormulario', JSON.stringify(datosUsuario));

      if (this.formaDePago == 'tarjeta') {
        const data = {
          buy_order: 'ordenCompra12345',
          session_id: 'sesion12345',
          amount: this.totalAPagar,
          return_url: 'http://127.0.0.1:4200/pago-confirmado'
        };

        this.carritoService.getCSRFTokenFromServer().subscribe(response => {
          this.carritoService.iniciarPago(data).subscribe(
            (response: WebpayResponse) => {
              this.isLoading = false;
              // Redirige al usuario a la URL de Webpay
              console.log(response);
              window.location.href = `${response.url}?token_ws=${response.token}`;
            },
            error => {
              console.error('Error al iniciar el pago:', error);
              this.isLoading = false;
            }
          );
        });
      } else {
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigateByUrl('/pago-confirmado')
        }, 3000);
      }
    }else{
    }
  }

  habilitarOpciones(tipo: string): void {
    if (tipo === 'retiro') {
      this.opcionEntrega = 'retiro';
      this.costoEnvio = 0;
  
      // Eliminar validaciones de los campos opcionales
      this.formularioVenta.get('region')?.clearValidators();
      this.formularioVenta.get('comuna')?.clearValidators();
      this.formularioVenta.get('calle')?.clearValidators();
  
      // Actualizar estado del formulario
      this.formularioVenta.get('region')?.updateValueAndValidity();
      this.formularioVenta.get('comuna')?.updateValueAndValidity();
      this.formularioVenta.get('calle')?.updateValueAndValidity();
    } else if (tipo === 'despacho') {
      this.opcionEntrega = 'despacho';
  
      // Agregar validaciones a los campos opcionales
      this.formularioVenta.get('region')?.setValidators(Validators.required);
      this.formularioVenta.get('comuna')?.setValidators(Validators.required);
      this.formularioVenta.get('calle')?.setValidators(Validators.required);
  
      // Actualizar estado del formulario
      this.formularioVenta.get('region')?.updateValueAndValidity();
      this.formularioVenta.get('comuna')?.updateValueAndValidity();
      this.formularioVenta.get('calle')?.updateValueAndValidity();
    }
  }
  

  cambiarRegion(): void {
    const regionEncontrada = this.regiones.find(
      (r) => r.region === this.regionSeleccionada
    );
    this.comunasFiltradas = regionEncontrada ? regionEncontrada.comunas : [];
    this.comunaSeleccionada = '';
  }

  asignarCostoEnvio() {
    this.costoEnvio = 3990;
  }

}