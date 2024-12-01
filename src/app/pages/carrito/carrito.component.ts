import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { HeaderComponent } from '../../components/header/header.component';
import { RedesSocialesComponent } from '../../components/redes-sociales/redes-sociales.component';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WebpayResponse } from '../../interfaces/bermellona';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';

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
        "region": "Valparaíso",
        "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
      },
      {
        "region": "Región del Libertador Gral. Bernardo O’Higgins",
        "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
      },
      {
        "region": "Región del Maule",
        "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
      },
      {
        "region": "Región de Ñuble",
        "comunas": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
      },
      {
        "region": "Región del Biobío",
        "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
      },
      {
        "region": "Región de la Araucanía",
        "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
      },
      {
        "region": "Región de Los Ríos",
        "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
      },
      {
        "region": "Región de Los Lagos",
        "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
      },
      {
        "region": "Región Aisén del Gral. Carlos Ibáñez del Campo",
        "comunas": ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
      },
      {
        "region": "Región de Magallanes y de la Antártica Chilena",
        "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
      },
      {
        "region": "Región Metropolitana de Santiago",
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
  totalAPagar : number = 0;

  usuarioLogueado$: Observable<boolean>;
  perfilUsuario$: Observable<any>;

  constructor(private carritoService: CarritoService, private route: ActivatedRoute, private authService: LoginService, private router : Router) {
    this.usuarioLogueado$ = this.authService.isAuthenticated();
    this.perfilUsuario$ = this.authService.getUserProfile();
  }

  ngOnInit(): void {
    this.authService.fetchUserProfile();
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
    this.totalAPagar = subtotal + this.costoEnvio; 
    return subtotal + this.costoEnvio; // Suma el costo de envío solo una vez
  }


  calcularCantidadTotal(): number {
    return this.carrito.reduce((total, producto) => {
      return total + producto.cantidad;
    }, 0);  // Calcula el total de cantidad de productos en el carrito
  }

  // Método para ir a la página de pago (puedes redirigir a otra página o implementar lógica aquí)
  irAPagar(): void {
    this.isLoading = true;
    if (this.formaDePago == 'tarjeta') {
      const data = {
        buy_order: 'ordenCompra12345',
        session_id: 'sesion12345',
        amount: this.totalAPagar,
        return_url: 'http://localhost:4200/pago-confirmado'
      };

      this.carritoService.getCSRFTokenFromServer().subscribe(response => {
        this.carritoService.iniciarPago(data).subscribe(
          (response: WebpayResponse) => {
            this.isLoading = false;
            // Redirige al usuario a la URL de Webpay
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
  }

  habilitarOpciones(tipo: string): void {
    if (tipo === 'retiro') {
      this.opcionEntrega = 'retiro'
      this.costoEnvio = 0;
    } else if (tipo === 'despacho') {
      this.opcionEntrega = 'despacho'
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