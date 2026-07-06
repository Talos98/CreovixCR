import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { ProfessionalService } from '../../../core/services/professional.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProfessionalCreateDto, ProfessionalUpdateDto } from '../../../core/models/professional.model';
import { environment } from '../../../../environments/environment.development';

@Component({
    selector: 'app-profesional-create-page',
    standalone: true,
    imports: [ProfesionalForm, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
    templateUrl: './profesional-create-page.html',
})
export class ProfesionalCreatePage {
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly professionalService = inject(ProfessionalService);
    private readonly noti = inject(NotificationService);

    usuarios = signal<any[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    constructor() {
        this.cargarDatosFormulario();
    }

    cargarDatosFormulario() {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<any>(`${environment.apiUrl}/user`).subscribe({
            next: (response) => {
                const users = response.data?.data ?? response.data ?? [];
                this.usuarios.set(users.filter((u: any) => u.role === 'PROFESSIONAL'));
            },
            error: () => {
                this.error.set('No se pudieron cargar los usuarios');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    guardar(data: ProfessionalCreateDto | ProfessionalUpdateDto) {
        this.saving.set(true);
        this.error.set(null);

        this.professionalService.crear(data as ProfessionalCreateDto).subscribe({
            next: () => {
                this.noti.success('Profesional registrado correctamente');
                this.router.navigate(['/admin/profesionales']);
            },
            error: () => {
                this.error.set('No se pudo registrar el profesional');
                this.saving.set(false);
            },
        });
    }

    cancelar() {
        this.router.navigate(['/admin/profesionales']);
    }
}
