import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
    selector: 'app-cita-detail',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './cita-detail.html',
    styleUrl: './cita-detail.css',
})
export class CitaDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly appointmentService = inject(AppointmentService);

    cita = signal<Appointment | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.error.set('El identificador de la cita no es valido.');
            return;
        }
        this.loadCita(id);
    }

    loadCita(id: number): void {
        this.loading.set(true);
        this.error.set(null);

        this.appointmentService.obtenerPorId(id).subscribe({
            next: (response) => {
                this.cita.set(response.data);
                this.loading.set(false);
            },
            error: () => {
                this.error.set('No se pudo cargar el detalle de la cita.');
                this.loading.set(false);
            },
        });
    }

    formatDate(dateStr: string): string {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    formatTime(timeStr: string): string {
        if (!timeStr) return '—';
        const date = new Date(timeStr);
        return date.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            PENDING: 'Pendiente',
            ACCEPTED: 'Aceptada',
            REJECTED: 'Rechazada',
            CANCELLED: 'Cancelada',
            COMPLETED: 'Completada',
        };
        return labels[status] ?? status;
    }

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            PENDING: 'status-pending',
            ACCEPTED: 'status-accepted',
            REJECTED: 'status-rejected',
            CANCELLED: 'status-cancelled',
            COMPLETED: 'status-completed',
        };
        return classes[status] ?? '';
    }
}
