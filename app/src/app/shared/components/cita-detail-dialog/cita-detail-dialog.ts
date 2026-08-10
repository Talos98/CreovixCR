import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Appointment } from '../../../core/models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-cita-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './cita-detail-dialog.html',
  styleUrl: './cita-detail-dialog.css',

})
export class CitaDetailDialog {

  updating = signal(false);

constructor(
  @Inject(MAT_DIALOG_DATA) public data: Appointment,
  private dialogRef: MatDialogRef<CitaDetailDialog>,
  private appointmentService: AppointmentService
) {}

goToDetail(): void {
  this.dialogRef.close('goToDetail');
}

changeStatus(status: string): void {
  this.updating.set(true);
  this.appointmentService.cambiarEstado(this.data.id, status).subscribe({
    next: (response) => {
      this.data.status = response.data.status;
      this.updating.set(false);
      this.dialogRef.close('statusChanged');
    },
    error: () => {
      this.updating.set(false);
    }
  });
}

getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    PENDING: 'status-pending',
    ACCEPTED: 'status-accepted',
    REJECTED: 'status-rejected',
    CANCELLED: 'status-cancelled',
    COMPLETED: 'status-completed'
  };

  return classes[status] ?? 'status-default';
}

  statusMap: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada'
};

getStatusLabel(status: string): string {
   return this.statusMap[status?.toLowerCase()] || status;
}
}
