import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfessionalService } from '../../../core/services/professional.service';
import { ProfessionalProfile } from '../../../core/models/professional.model';

@Component({
    selector: 'app-profesional-detail',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './profesional-detail.html',
    styleUrl: './profesional-detail.css',
})
export class ProfesionalDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly professionalService = inject(ProfessionalService);

    profesional = signal<ProfessionalProfile | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.error.set('El identificador del profesional no es valido.');
            return;
        }
        this.loadProfesional(id);
    }

    loadProfesional(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.professionalService.obtenerPorId(id).subscribe({
            next: (response) => {
                this.profesional.set(response.data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('No se pudo cargar el detalle del profesional.');
                this.loading.set(false);
            },
        });
    }

  getImageUrl(imageName: string): string {
    return this.professionalService.getImageUrl(imageName);
  }
}
