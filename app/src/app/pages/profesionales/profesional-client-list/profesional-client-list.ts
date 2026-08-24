import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProfessionalService } from '../../../core/services/professional.service';
import { ProfessionalProfile } from '../../../core/models/professional.model';

@Component({
    selector: 'app-profesional-client-list',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './profesional-client-list.html',
    styleUrl: './profesional-client-list.css'
})
export class ProfesionalClientList {

    private readonly professionalService = inject(ProfessionalService);

    profesionales = signal<ProfessionalProfile[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.cargarProfesionales();
    }

    cargarProfesionales(): void {

        this.loading.set(true);
        this.error.set(null);

        this.professionalService.listar().subscribe({

            next: (response) => {

                this.profesionales.set(response.data.data);
                this.loading.set(false);

            },

            error: () => {

                this.error.set(
                    'No se pudieron cargar los profesionales.'
                );

                this.loading.set(false);

            }

        });
    }

    getImageUrl(imageName: string): string {
        return this.professionalService.getImageUrl(imageName);
    }
}