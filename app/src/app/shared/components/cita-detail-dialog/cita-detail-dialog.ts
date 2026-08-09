import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-cita-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './cita-detail-dialog.html',
  styleUrl: './cita-detail-dialog.css',
  
})
export class CitaDetailDialog {

constructor(
  @Inject(MAT_DIALOG_DATA) public data: Appointment,
  private dialogRef: MatDialogRef<CitaDetailDialog>
) {}

goToDetail(): void {
  this.dialogRef.close('goToDetail');
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
