import { Component, OnInit, inject, signal } from '@angular/core';
import { CitasList } from '../citas-list/citas-list';
import { CitasCalendar } from '../cita-calendar/calendar';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/appointment.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cita-page',
  standalone: true,
  imports: [CitasList, CitasCalendar, MatButtonModule, MatIcon],
  templateUrl: './cita-page.html',
  styleUrl: './cita-page.css',
})
export class CitaPage implements OnInit {

  private readonly appointmentService = inject(AppointmentService);

  viewMode: 'list' | 'calendar' = 'list';

  citas = signal<Appointment[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.loading.set(true);
    this.error.set(null);

    this.appointmentService.listar().subscribe({
      next: (response) => {
        console.log('Citas cargadas en CitaPage:', response.data);

        this.citas.set(response.data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error cargando citas:', error);

        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      }
    });
  }
}
