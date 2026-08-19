import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { ProfessionalService } from '../../../core/services/professional.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProfessionalProfile, ProfessionalCreateDto, ProfessionalUpdateDto } from '../../../core/models/professional.model';

@Component({
    selector: 'app-profesional-mi-perfil',
    standalone: true,
    imports: [ProfesionalForm, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
    templateUrl: './profesional-mi-perfil.html',
})
export class ProfesionalMiPerfil {
    private readonly router = inject(Router);
    private readonly professionalService = inject(ProfessionalService);
    private readonly authService = inject(AuthService);
    private readonly noti = inject(NotificationService);

    profesional = signal<ProfessionalProfile | null>(null);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    constructor() {
        this.loadProfile();
    }

    loadProfile() {
        this.loading.set(true);
        this.error.set(null);

        const user = this.authService.user();
        if (!user) {
            this.error.set('No se pudo obtener la información del usuario');
            this.loading.set(false);
            return;
        }

        this.professionalService.listar().subscribe({
            next: (response: any) => {
                const profiles: ProfessionalProfile[] = response.data ?? response ?? [];
                const myProfile = profiles.find((p: ProfessionalProfile) => p.userId === user.id);
                if (myProfile) {
                    this.profesional.set(myProfile);
                } else {
                    this.error.set('No se encontró tu perfil profesional. Contacta al administrador.');
                }
            },
            error: () => {
                this.error.set('No se pudo cargar la información del perfil');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    guardar(data: ProfessionalCreateDto | ProfessionalUpdateDto) {
        const prof = this.profesional();
        if (!prof) return;

        this.saving.set(true);
        this.error.set(null);

        this.professionalService.actualizar(prof.id, data as ProfessionalUpdateDto).subscribe({
            next: () => {
                this.noti.success('Perfil actualizado correctamente');
                this.loadProfile();
                this.saving.set(false);
            },
            error: () => {
                this.error.set('No se pudo actualizar el perfil');
                this.saving.set(false);
            },
        });
    }

    cancelar() {
        this.router.navigate(['/perfil']);
    }
}
