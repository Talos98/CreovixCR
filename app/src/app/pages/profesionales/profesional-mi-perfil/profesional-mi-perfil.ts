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

        this.professionalService.obtenerMiPerfil().subscribe({
            next: (response) => {
                console.log('MI PERFIL:', response);

                this.profesional.set(response.data);
            },

            error: (error) => {
                console.error('ERROR AL CARGAR MI PERFIL:', error);

                this.profesional.set(null);

                this.error.set(
                    error.error?.message ||
                    'No se pudo cargar la información del perfil'
                );
            },

            complete: () => {
                this.loading.set(false);
            }
        });
    }

    guardar(data: ProfessionalCreateDto | ProfessionalUpdateDto) {

        this.saving.set(true);
        this.error.set(null);

        const prof = this.profesional();

        // =========================
        // CREAR PERFIL
        // =========================
        if (!prof) {

            this.professionalService.crear(
                data as ProfessionalCreateDto
            ).subscribe({

                next: () => {
                    this.noti.success(
                        'Perfil profesional creado correctamente'
                    );

                    this.loadProfile();
                    this.saving.set(false);
                },

                error: () => {
                    this.error.set(
                        'No se pudo crear el perfil profesional'
                    );

                    this.saving.set(false);
                }

            });

            return;
        }

        // =========================
        // ACTUALIZAR PERFIL
        // =========================
        this.professionalService.actualizar(
            prof.id,
            data as ProfessionalUpdateDto
        ).subscribe({

            next: (response) => {

                console.log('RESPUESTA UPDATE:', response);

                const updatedProfile: ProfessionalProfile = {
                    ...response.data.profile,
                    user: response.data.user
                };
                this.profesional.set(updatedProfile);

                this.noti.success(
                    'Perfil actualizado correctamente'
                );


                this.saving.set(false);
            },

            error: (error) => {
                console.error('ERROR AL ACTUALIZAR PERFIL:', error);
                console.error('STATUS:', error.status);
                console.error('ERROR BODY:', error.error);
                console.log('VALIDATION ERRORS:', error.error?.validationErrors);

                this.error.set(
                    error.error?.message ||
                    'No se pudo actualizar el perfil'
                );

                this.saving.set(false);
            }

        });
    }

    cancelar() {
        this.router.navigate(['/perfil']);
    }
}
