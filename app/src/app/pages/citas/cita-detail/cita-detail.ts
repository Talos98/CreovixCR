import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewCreateDto } from '../../../core/models/review.model';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MotivoDialog } from '../../../shared/components/motivo-dialog/motivo-dialog';
import { Role } from '../../../core/models/role.model';

@Component({
    selector: 'app-cita-detail',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './cita-detail.html',
    styleUrl: './cita-detail.css',
})
export class CitaDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly appointmentService = inject(AppointmentService);
    private readonly reviewService = inject(ReviewService);
    private readonly authService = inject(AuthService);
    private readonly location = inject(Location);
    private readonly dialog = inject(MatDialog);

    readonly rol = this.authService.rol;
    readonly Role = Role;

    cita = signal<Appointment | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    showReviewForm = signal(false);
    reviewRating = signal(5);
    reviewComment = signal('');
    submittingReview = signal(false);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.error.set('El identificador de la cita no es valido.');
            return;
        }
        this.loadCita(id);
    }

    volver(): void {
        this.location.back();
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

    formatDateTime(dateStr: string): string {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
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

    updating = signal(false);

    changeStatus(status: string): void {
        const cita = this.cita();
        if (!cita) return;

        if (status === 'REJECTED' || status === 'CANCELLED') {
            const titulo = status === 'REJECTED' ? 'Rechazar cita' : 'Cancelar cita';
            const mensaje = status === 'REJECTED'
                ? '¿Está seguro de rechazar esta cita? Debe indicar un motivo.'
                : '¿Está seguro de cancelar esta cita? Debe indicar un motivo.';

            this.dialog.open(MotivoDialog, {
                width: '450px',
                data: { titulo, mensaje }
            }).afterClosed().subscribe((motivo: string | undefined) => {
                if (motivo) {
                    this.ejecutarCambioEstado(cita.id, status, motivo);
                }
            });
        } else {
            this.ejecutarCambioEstado(cita.id, status);
        }
    }

    private ejecutarCambioEstado(id: number, status: string, comment?: string): void {
        this.updating.set(true);
        this.appointmentService.cambiarEstado(id, status, comment).subscribe({
            next: () => {
                this.loadCita(id);
                this.updating.set(false);
            },
            error: () => {
                this.updating.set(false);
            }
        });
    }

    submitReview(): void {
        const cita = this.cita();
        if (!cita) return;

        this.submittingReview.set(true);

        const data: ReviewCreateDto = {
            clientId: cita.clientId,
            professionalId: cita.professionalId,
            appointmentId: cita.id,
            rating: this.reviewRating(),
            comment: this.reviewComment() || undefined,
        };

        this.reviewService.crear(data).subscribe({
            next: () => {
                this.loadCita(cita.id);
                this.reviewRating.set(5);
                this.reviewComment.set('');
                this.showReviewForm.set(false);
                this.submittingReview.set(false);
            },
            error: () => {
                this.submittingReview.set(false);
            },
        });
    }
}
