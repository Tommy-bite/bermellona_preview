import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginGoogleService {
    constructor(private http: HttpClient, private oAuthService: OAuthService) {
        this.initLogin();
    }

    initLogin() {
        const config: AuthConfig = {
            issuer: 'https://accounts.google.com',
            strictDiscoveryDocumentValidation: false,
            clientId: '943523633586-acis19plcd1rc8jvkm3c3hht3p4ig521.apps.googleusercontent.com',
            redirectUri: window.location.origin,
            scope: 'openid profile email'
        }

        this.oAuthService.configure(config);
        this.oAuthService.setupAutomaticSilentRefresh();
        this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    }

    login() {
        this.oAuthService.initLoginFlow();
    }

    logout() {
        this.oAuthService.logOut();
    }


    getProfile() {
        const claims: any = this.oAuthService.getIdentityClaims();
        if (claims) {
            return {
                email: claims.email,
                name: claims.name
            };
        }
        return null;
    }



}