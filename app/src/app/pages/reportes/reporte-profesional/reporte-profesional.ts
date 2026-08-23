import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-reporte-profesional',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, NgxChartsModule],
  templateUrl: './reporte-profesional.html',
  styleUrl: './reporte-profesional.css',
})
export class ReporteProfesional {
  private readonly citaService = inject(AppointmentService);
  private readonly servicioService = inject(ServicioService);
  private readonly authService = inject(AuthService);

  private allCitas = signal<Appointment[]>([]);
  private allServicios = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  misCitas = computed(() => {
    const user = this.authService.user();
    if (!user) return [];
    return this.allCitas().filter(c => c.professionalId === user.id);
  });

  misServicios = computed(() => {
    const user = this.authService.user();
    if (!user) return [];
    return this.allServicios().filter(s => s.professionalId === user.id);
  });

  totalCitas = computed(() => this.misCitas().length);
  citasPendientes = computed(() => this.misCitas().filter(c => c.status === 'PENDING').length);
  citasAceptadas = computed(() => this.misCitas().filter(c => c.status === 'ACCEPTED').length);
  citasCompletadas = computed(() => this.misCitas().filter(c => c.status === 'COMPLETED').length);
  citasCanceladas = computed(() => this.misCitas().filter(c => c.status === 'CANCELLED').length);

  totalServicios = computed(() => this.misServicios().length);
  serviciosActivos = computed(() => this.misServicios().filter(s => s.status === 'ACTIVE').length);

  ratingPromedio = computed(() => {
    const completadas = this.misCitas().filter(c => c.status === 'COMPLETED' && c.review);
    if (completadas.length === 0) return 0;
    const sum = completadas.reduce((acc, c) => acc + (c.review?.rating ?? 0), 0);
    return Math.round((sum / completadas.length) * 10) / 10;
  });

  totalReviews = computed(() => {
    return this.misCitas().filter(c => c.review).length;
  });

  colorScheme: any = { domain: ['#f59e0b', '#0c3c2c', '#22c55e', '#6b7280'] };

  citasPorEstadoChart = computed(() => [
    { name: 'Pendientes', value: this.citasPendientes() },
    { name: 'Aceptadas', value: this.citasAceptadas() },
    { name: 'Completadas', value: this.citasCompletadas() },
    { name: 'Canceladas', value: this.citasCanceladas() },
  ]);

  serviciosPorEstadoChart = computed(() => [
    { name: 'Activos', value: this.serviciosActivos() },
    { name: 'Inactivos', value: this.totalServicios() - this.serviciosActivos() },
  ]);

  ratingColorScheme: any = { domain: ['#e85320'] };

  ratingPorMesChart = computed(() => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ahora = new Date();
    const anioActual = ahora.getFullYear();

    const reviewsPorMes: { [key: number]: number[] } = {};
    for (let i = 0; i < 12; i++) reviewsPorMes[i] = [];

    this.misCitas()
      .filter(c => c.review?.createdAt)
      .forEach(c => {
        const fecha = new Date(c.review!.createdAt!);
        if (fecha.getFullYear() === anioActual) {
          reviewsPorMes[fecha.getMonth()].push(c.review!.rating);
        }
      });

    return meses.map((mes, i) => {
      const ratings = reviewsPorMes[i];
      const promedio = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;
      return { name: mes, value: promedio };
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      citas: this.citaService.listar(),
      servicios: this.servicioService.listar(),
    }).subscribe({
      next: ({ citas, servicios }) => {
        this.allCitas.set(citas.data ?? []);
        this.allServicios.set(servicios.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del reporte.');
        this.loading.set(false);
      },
    });
  }
}
