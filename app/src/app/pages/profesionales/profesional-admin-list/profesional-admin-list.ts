import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ProfessionalService } from '../../../core/services/professional.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProfessionalProfile } from '../../../core/models/professional.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-profesional-admin-list',
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    templateUrl: './profesional-admin-list.html',
    styleUrl: './profesional-admin-list.css',
})
export class ProfesionalAdminList {
    private readonly professionalService = inject(ProfessionalService);
    private readonly noti = inject(NotificationService);
    private readonly dialog = inject(MatDialog);

    profesionales = signal<ProfessionalProfile[]>([]);
    search = signal('');
    modeFilter = signal<'ONLINE' | 'IN_PERSON' | null>(null);
    availabilityFilter = signal<boolean | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    displayedColumns = ['name', 'title', 'mode', 'baseRate', 'isAvailable', 'actions'];

    profesionalesFiltrados = computed(() => {
        let list = this.profesionales();
        const searchTerm = this.search().toLowerCase().trim();
        const mode = this.modeFilter();
        const availability = this.availabilityFilter();

        if (searchTerm) {
            list = list.filter((p) =>
                (p.user?.name ?? '').toLowerCase().includes(searchTerm)
            );
        }

        if (mode !== null) {
            list = list.filter((p) => p.mode === mode);
        }

        if (availability !== null) {
            list = list.filter((p) => p.isAvailable === availability);
        }

        return list;
    });

    ngOnInit(): void {
        this.loadProfesionales();
    }

    loadProfesionales(): void {
        this.loading.set(true);
        this.error.set(null);

        this.professionalService.listar().subscribe({
            next: (response: any) => {
                const data = response.data?.data ?? response.data ?? [];
                this.profesionales.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('No se pudieron cargar los profesionales.');
                this.loading.set(false);
            },
        });
    }
    openAvailabilityDialog(prof: ProfessionalProfile): void {
        const isAvailable = prof.isAvailable;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: isAvailable
                    ? 'Desactivar disponibilidad'
                    : 'Activar disponibilidad',

                message: `¿Deseas ${isAvailable ? 'desactivar' : 'activar'
                    } la disponibilidad de ${prof.user?.name ?? 'este profesional'
                    }?`,

                warning: isAvailable
                    ? 'El profesional dejará de aparecer como disponible.'
                    : 'El profesional volverá a estar disponible para solicitudes.',

                confirmText: isAvailable
                    ? 'Desactivar'
                    : 'Activar',
            },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.toggleAvailability(prof);
            }
        });
    }
    toggleAvailability(prof: ProfessionalProfile): void {
        const isAvailable = prof.isAvailable;

        this.professionalService.toggleAvailability(prof.id).subscribe({
            next: () => {
                this.noti.success(
                    `Disponibilidad ${isAvailable ? 'desactivada' : 'activada'
                    } correctamente`
                );

                this.loadProfesionales();
            },
            error: () => {
                this.noti.error(
                    'No se pudo actualizar la disponibilidad'
                );
            },
        });
    }


    onSearchChange(value: string): void {
        this.search.set(value);
    }

    onModeChange(value: 'ONLINE' | 'IN_PERSON' | null): void {
        this.modeFilter.set(value);
    }

    onAvailabilityChange(value: boolean | null): void {
        this.availabilityFilter.set(value);
    }
}
