import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
    selector: 'app-citas-list',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
    ],
    templateUrl: './citas-list.html',
    styleUrl: './citas-list.css',
})
export class CitasList {

    citas = input<Appointment[]>([]);


    statusFilter = signal<string | null>(null);
    professionalFilter = signal<number | null>(null);
    dateFrom = signal('');
    dateTo = signal('');

    displayedColumns = ['client', 'professional', 'service', 'date', 'time', 'status', 'actions'];

    professionals = computed(() => {
        const map = new Map<number, { id: number; name: string }>();
        for (const cita of this.citas()) {
            if (cita.professional && !map.has(cita.professionalId)) {
                map.set(cita.professionalId, { id: cita.professionalId, name: cita.professional.name });
            }
        }
        return Array.from(map.values());
    });

    citasFiltradas = computed(() => {
        let result = this.citas();

        const status = this.statusFilter();
        if (status) {
            result = result.filter((c) => c.status === status);
        }

        const profId = this.professionalFilter();
        if (profId) {
            result = result.filter((c) => c.professionalId === profId);
        }

        const from = this.dateFrom();
        if (from) {
            result = result.filter((c) => c.date >= from);
        }

        const to = this.dateTo();
        if (to) {
            result = result.filter((c) => c.date <= to);
        }

        return result;
    });


    formatDate(dateStr: string): string {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });
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

    onStatusChange(value: string | null): void {
        this.statusFilter.set(value);
    }

    onProfessionalChange(value: number | null): void {
        this.professionalFilter.set(value);
    }

    onDateFromChange(event: Event): void {
        this.dateFrom.set((event.target as HTMLInputElement).value);
    }

    onDateToChange(event: Event): void {
        this.dateTo.set((event.target as HTMLInputElement).value);
    }
}
