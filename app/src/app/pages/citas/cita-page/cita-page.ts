import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CitasList } from '../citas-list/citas-list';
import { CitasCalendar } from '../cita-calendar/calendar';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Role } from '../../../core/models/role.model';
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
  private readonly authService = inject(AuthService);

  viewMode: 'list' | 'calendar' = 'list';

  private allCitas = signal<Appointment[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  /** Filtra las citas según el rol del usuario logueado */
  citas = computed(() => {
    const all = this.allCitas();
    const user = this.authService.user();
    const rol = this.authService.rol();

    if (!user) return [];

    // Admin ve todas las citas
    if (rol === Role.ADMIN) return all;

    // Profesional ve solo sus citas como profesional
    if (rol === Role.PROFESSIONAL) {
      return all.filter(c => c.professionalId === user.id);
    }

    // Cliente ve solo sus citas como cliente
    return all.filter(c => c.clientId === user.id);
  });

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.loading.set(true);
    this.error.set(null);

    this.appointmentService.listar().subscribe({
      next: (response) => {
        this.allCitas.set(response.data);
        this.loading.set(false);
      },

      error: () => {
        this.error.set('No se pudieron cargar las citas.');
        this.loading.set(false);
      }
    });
  }
}
