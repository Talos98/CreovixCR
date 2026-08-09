import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  CalendarModule,
  CalendarView,
  CalendarEvent
} from 'angular-calendar';

import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-citas-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CitasCalendar  {

  citas = input<Appointment[]>([]);

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  CalendarView = CalendarView;

  events = computed<CalendarEvent[]>(() =>
  this.citas().map((appointment) =>
    this.mapToEvent(appointment)
  )
);

  mapToEvent(appointment: Appointment): CalendarEvent {
    return {
      id: appointment.id,

      title: appointment.description || 'Cita',

      start: new Date(appointment.startTime),
      end: new Date(appointment.endTime),

      color: this.getColor(appointment.status),

      meta: appointment,
    };
  }

  handleEvent(event: CalendarEvent): void {
    console.log('Cita:', event.meta);
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