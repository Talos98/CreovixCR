import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ServicioService } from '../../../core/services/servicio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-servicio-mis-servicios',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './servicio-mis-servicios.html',
  styleUrl: './servicio-mis-servicios.css',
})
export class ServicioMisServicios {
  private readonly servicioService = inject(ServicioService);
  private readonly authService = inject(AuthService);
  private readonly noti = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  private allServicios = signal<Service[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['name', 'category', 'price', 'duration', 'mode', 'status', 'actions'];

  servicios = computed(() => {
    const user = this.authService.user();
    if (!user) return [];
    return this.allServicios().filter(s => s.professionalId === user.id);
  });

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    return this.servicios().filter(srv => {
      return !texto || srv.name?.toLowerCase().includes(texto);
    });
  });

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicioService.listar().subscribe({
      next: (response) => {
        this.allServicios.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }

  openStatusDialog(srv: Service): void {
    const isActive = srv.status === 'ACTIVE';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: isActive ? 'Desactivar servicio' : 'Activar servicio',
        message: `¿Deseas ${isActive ? 'desactivar' : 'activar'} el servicio "${srv.name}"?`,
        warning: isActive
          ? 'El servicio dejará de estar disponible para los usuarios.'
          : 'El servicio volverá a estar disponible para solicitudes.',
        confirmText: isActive ? 'Desactivar' : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toggleStatus(srv);
      }
    });
  }

  toggleStatus(srv: Service): void {
    const isActive = srv.status === 'ACTIVE';

    this.servicioService.toggleStatus(srv.id).subscribe({
      next: () => {
        this.noti.success(
          `Servicio ${isActive ? 'desactivado' : 'activado'} correctamente`
        );
        this.loadServicios();
      },
      error: () => {
        this.noti.error('No se pudo cambiar el estado del servicio');
      },
    });
  }
}
