import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CitaDetailDialog } from '../../../shared/components/cita-detail-dialog/cita-detail-dialog.js';



import {
  CalendarMonthViewComponent,
  CalendarWeekViewComponent,
  CalendarView,
  CalendarEvent
} from 'angular-calendar';

import { Appointment } from '../../../core/models/appointment.model';


@Component({
  selector: 'app-citas-calendar',
  standalone: true,
  imports: [CommonModule, CalendarMonthViewComponent, CalendarWeekViewComponent, MatDialogModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CitasCalendar {

  constructor (private dialog: MatDialog,
              private router: Router
  ) {}

  citas = input<Appointment[]>([]);
  statusChanged = output<void>();

  view = signal<CalendarView>(CalendarView.Month);

  viewDate = signal<Date>(new Date());

  CalendarView = CalendarView;

  events = computed<CalendarEvent[]>(() =>
    this.citas().map((appointment) =>
      this.mapToEvent(appointment)
    )
  );

  mapToEvent(appointment: Appointment): CalendarEvent {
    return {
      id: appointment.id,

      title: `${appointment.client?.name ?? 'Cliente'} - ${appointment.service?.name ?? ''}`,

      start: new Date(appointment.startTime),
      end: new Date(appointment.endTime),

      color: this.getColor(appointment.status),

      meta: appointment,
    };
  }


calendarTitle = computed(() => {
    if (this.view() === CalendarView.Month) {
        return this.viewDate().toLocaleDateString('es-CR', {
            month: 'long',
            year: 'numeric'
        });
    }

    const start = new Date(this.viewDate());

    let month = start.toLocaleDateString('es-CR', {
        month: 'short'
    });

    month = month.charAt(0).toUpperCase() + month.slice(1);

    return `Semana del ${start.getDate()} ${month}`;
});



  previousPeriod(): void {
    this.viewDate.set(this.movePeriod(-1));
  }

  nextPeriod(): void {
    this.viewDate.set(this.movePeriod(1));
  }

  goToToday(): void {
    this.viewDate.set(new Date());
  }

  private movePeriod(direction: number): Date {
    const date = new Date(this.viewDate());

    if (this.view() === CalendarView.Month) {
      date.setMonth(date.getMonth() + direction);
    } else if (this.view() === CalendarView.Week) {
      date.setDate(date.getDate() + direction * 7);
    }

    return date;
  }

handleEvent(event: CalendarEvent): void {
  const cita = event.meta as Appointment;

  const dialogRef = this.dialog.open(CitaDetailDialog, {
    data: cita,
    width: '400px'
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'goToDetail') {
      this.router.navigate(['/admin/citas', cita.id]);
    } else if (result === 'statusChanged') {
      this.statusChanged.emit();
    }
  });
}
  getColor(status: string) {

    switch (status) {

      case 'ACCEPTED':
        return {
          primary: '#28a745',
          secondary: '#C3E6CB'
        };

      case 'PENDING':
        return {
          primary: '#ffc107',
          secondary: '#FFE8A1'
        };

      case 'CANCELLED':
        return {
          primary: '#dc3545',
          secondary: '#F5C6CB'
        };

      case 'REJECTED':
        return {
          primary: '#dc3545',
          secondary: '#F5C6CB'
        };

      case 'COMPLETED':
        return {
          primary: '#007bff',
          secondary: '#D6E9FF'
        };

      default:
        return {
          primary: '#6c757d',
          secondary: '#E2E3E5'
        };
    }
  }
}