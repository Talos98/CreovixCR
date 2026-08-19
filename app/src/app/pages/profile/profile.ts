import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormField, form, required, email, minLength } from '@angular/forms/signals';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { Role } from '../../core/models/role.model';

interface ProfileFormModel {
    name: string;
    lastName: string;
    email: string;
}

@Component({
    selector: 'app-profile',
    imports: [
        FormField,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class Profile {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly noti = inject(NotificationService);
    private readonly router = inject(Router);
    readonly user = this.authService.user;

    readonly editando = signal(false);
    readonly guardando = signal(false);

    readonly profileModel = signal<ProfileFormModel>({
        name: '',
        lastName: '',
        email: '',
    });

    readonly profileForm = form(this.profileModel, (path) => {
        required(path.name, { message: 'El nombre es obligatorio' });
        minLength(path.name, 2, { message: 'Mínimo 2 caracteres' });
        required(path.lastName, { message: 'Los apellidos son obligatorios' });
        required(path.email, { message: 'El correo es obligatorio' });
        email(path.email, { message: 'Ingrese un correo válido' });
    });

    readonly iniciales = computed(() => {
        const name = this.user()?.name?.trim();
        if (!name) {
            return 'US';
        }
        return name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((parte) => parte.charAt(0).toUpperCase())
            .join('');
    });

    readonly rolDescription = computed(() => {
        const role = this.user()?.role;
        switch (role) {
            case Role.ADMIN:
                return 'Administrador';
            case Role.PROFESSIONAL:
                return 'Profesional';
            default:
                return 'Cliente';
        }
    });

    readonly isAdministrator = computed(
        () => this.user()?.role === Role.ADMIN,
    );

    readonly iconoRol = computed(() =>
        this.isAdministrator() ? 'admin_panel_settings' : 'person',
    );

    activarEdicion(): void {
        const u = this.user();
        if (!u) return;
        this.profileModel.set({
            name: u.name,
            lastName: u.lastName,
            email: u.email,
        });
        this.editando.set(true);
    }

    cancelarEdicion(): void {
        this.editando.set(false);
    }

    guardarPerfil(): void {
        if (this.guardando()) return;

        this.profileForm.name().markAsTouched();
        this.profileForm.lastName().markAsTouched();
        this.profileForm.email().markAsTouched();

        if (
            this.profileForm.name().invalid() ||
            this.profileForm.lastName().invalid() ||
            this.profileForm.email().invalid()
        ) {
            return;
        }

        const u = this.user();
        if (!u) return;

        this.guardando.set(true);
        const data = this.profileModel();

        this.userService.actualizar(u.id, data).subscribe({
            next: () => {
                this.noti.success('Perfil actualizado correctamente');
                this.editando.set(false);
                this.guardando.set(false);
                // Recargar perfil para reflejar cambios sin recarga manual
                this.authService.loadProfile().subscribe();
            },
            error: () => {
                this.noti.error('No se pudo actualizar el perfil');
                this.guardando.set(false);
            },
        });
    }

    closeSession(): void {
        this.authService.logout();
        void this.router.navigate(['/login']);
    }

    returnToInicio(): void {
        void this.router.navigate(['/']);
    }
}
