import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AutenticacionComponent } from './pages/autenticacion/autenticacion.component';
import { RecuperaPasswordComponent } from './pages/recupera-password/recupera-password.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { NuevaPasswordComponent } from './pages/nueva-password/nueva-password.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { PagoConfirmadoComponent } from './pages/pago-confirmado/pago-confirmado.component';

export const routes: Routes = [
    {
        path : '',
        component : HomeComponent
    },
    {
        path: 'home',
        component : HomeComponent
    },
    {
        path: 'autenticacion',
        component : AutenticacionComponent
    },
    {
        path: 'recuperar',
        component : RecuperaPasswordComponent
    },
    {
        path: 'tienda',
        component : TiendaComponent
    },
    {
        path: 'carrito',
        component : CarritoComponent
    },
    {
        path: 'admin',
        component : AdministracionComponent
    },
    {
        path: 'pago-confirmado',
        component : PagoConfirmadoComponent
    },
    {
        path: 'password-reset-confirm/:uid/:token',
        component : NuevaPasswordComponent
    },
    { path: '**', pathMatch: 'full', 
        component: PageNotFoundComponent 
    },
];
