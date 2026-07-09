import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfesionalForm } from '../../../shared/components/profesional-form/profesional-form';
import { ProfessionalService } from '../../../core/services/professional.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProfessionalProfile, ProfessionalCreateDto, ProfessionalUpdateDto } from '../../../core/models/professional.model';
import { environment } from '../../../../environments/environment.development';

@Component({
    selector: 'app-profesional-edit-page',
    standalone: true,
    imports: [ProfesionalForm, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
    templateUrl: './profesional-edit-page.html',
})
export class ProfesionalEditPage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly professionalService = inject(ProfessionalService);
    private readonly noti = inject(NotificationService);

    profesional = signal<ProfessionalProfile | null>(null);
    usuarios = signal<any[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    private readonly id = Number(this.route.snapshot.paramMap.get('id'));

    constructor() {
        this.loadFormData();
    }

    loadFormData() {
        if (!this.id) {
            this.error.set('El identificador del profesional no es valido');
            this.loading.set(false);
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.professionalService.obtenerPorId(this.id).subscribe({
            next: (resp) => {
                this.profesional.set(resp.data);
            },
            error: () => {
                this.error.set('No se pudo cargar la informacion del profesional');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    guardar(data: ProfessionalCreateDto | ProfessionalUpdateDto) {
        if (!this.id) return;

        this.saving.set(true);
        this.error.set(null);

        this.professionalService.actualizar(this.id, data as ProfessionalUpdateDto).subscribe({
            next: () => {
                this.noti.success('Profesional actualizado correctamente');
                this.router.navigate(['/admin/profesionales']);
            },
            error: () => {
                this.error.set('No se pudo actualizar el profesional');
                this.saving.set(false);
            },
        });
    }

    cancelar() {
        this.router.navigate(['/admin/profesionales']);
    }
}
