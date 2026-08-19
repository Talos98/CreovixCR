import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../core/services/auth.service'
import { Role } from '../../core/models/role.model';

@Component({
    selector: 'app-profile',
    imports: [
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,],
        templateUrl: './profile.html',
        styleUrl: './profile.css',
    
})
export class Profile {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    readonly user = this.authService.user;

    readonly iniciales= computed(() => {
        const name = this.user()?.name?.trim();
        if(!name){
            return 'US';
        }
        return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join('')
    });

    readonly rolDescription = computed(() => {
        const role = this.user()?.role;
        switch(role){
            case Role.ADMIN:
                return 'Administrador';
            case Role.PROFESSIONAL:
                return 'Profesional';
            default:
                return 'Cliente'
        }
    });

    readonly isAdministrator = computed(
        () => this.user()?.role === Role.ADMIN,
    );

    readonly iconoRol = computed (() =>
        this.isAdministrator() ? 'admin_panel_settings' : 'person',
    );

    closeSession() : void {
        this.authService.logout();
        void this.router.navigate(['/login']);
    }

    returnToInicio(): void {
        void this.router.navigate(['/inicio']);
    }
}

