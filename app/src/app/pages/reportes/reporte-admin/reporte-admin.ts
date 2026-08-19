import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { UserService } from '../../../core/services/user.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Service } from '../../../core/models/service.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-reporte-admin',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './reporte-admin.html',
  styleUrl: './reporte-admin.css',
})
export class ReporteAdmin {
  private readonly citaService = inject(AppointmentService);
  private readonly servicioService = inject(ServicioService);
  private readonly userService = inject(UserService);

  citas = signal<Appointment[]>([]);
  servicios = signal<Service[]>([]);
  usuarios = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  totalCitas = computed(() => this.citas().length);
  citasPendientes = computed(() => this.citas().filter(c => c.status === 'PENDING').length);
  citasAceptadas = computed(() => this.citas().filter(c => c.status === 'ACCEPTED').length);
  citasCompletadas = computed(() => this.citas().filter(c => c.status === 'COMPLETED').length);
  citasCanceladas = computed(() => this.citas().filter(c => c.status === 'CANCELLED').length);
  citasRechazadas = computed(() => this.citas().filter(c => c.status === 'REJECTED').length);

  totalServicios = computed(() => this.servicios().length);
  serviciosActivos = computed(() => this.servicios().filter(s => s.status === 'ACTIVE').length);

  totalUsuarios = computed(() => this.usuarios().length);
  totalProfesionales = computed(() => this.usuarios().filter(u => u.role === 'PROFESSIONAL').length);
  totalClientes = computed(() => this.usuarios().filter(u => u.role === 'CLIENT').length);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      citas: this.citaService.listar(),
      servicios: this.servicioService.listar(),
      usuarios: this.userService.listar(),
    }).subscribe({
      next: ({ citas, servicios, usuarios }) => {
        this.citas.set(citas.data ?? []);
        this.servicios.set(servicios.data ?? []);
        this.usuarios.set(usuarios.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del reporte.');
        this.loading.set(false);
      },
    });
  }
}
