import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AutenticacionComponent } from './pages/autenticacion/autenticacion.component';
import { RecuperaPasswordComponent } from './pages/recupera-password/recupera-password.component';
import { TiendaComponent } from './pages/tienda/tienda.component';

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
        path: '**',
        redirectTo: ''  
    }
];
