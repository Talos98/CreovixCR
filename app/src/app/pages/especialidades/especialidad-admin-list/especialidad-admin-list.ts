import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Specialty } from '../../../core/models/specialty.model';

@Component({
  selector: 'app-especialidad-admin-list',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './especialidad-admin-list.html',
  styleUrl: './especialidad-admin-list.css',
})
export class EspecialidadAdminList {
  private readonly specialtyService = inject(SpecialtyService);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  especialidades = signal<Specialty[]>([]);
  search = signal('');
  statusFilter = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['name', 'status', 'actions'];

  especialidadesFiltradas = computed(() => {
    let result = this.especialidades();
    const searchTerm = this.search().toLowerCase().trim();
    const status = this.statusFilter();

    if (searchTerm) {
      result = result.filter(e => e.name.toLowerCase().includes(searchTerm));
    }
    if (status) {
      result = result.filter(e => e.status === status);
    }
    return result;
  });

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades(): void {
    this.loading.set(true);
    this.error.set(null);

    this.specialtyService.listar().subscribe({
      next: (response) => {
        this.especialidades.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades.');
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }

  onStatusFilter(value: string): void {
    this.statusFilter.set(value || null);
  }

 openStatusDialog(esp: Specialty): void {
  const isActive = esp.status === 'ACTIVE';

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: isActive
        ? 'Desactivar especialidad'
        : 'Activar especialidad',

      message: `¿Deseas ${
        isActive ? 'desactivar' : 'activar'
      } la especialidad "${esp.name}"?`,

      warning: isActive
        ? 'La especialidad dejará de estar disponible para nuevos perfiles profesionales.'
        : 'La especialidad volverá a estar disponible para asignaciones.',

      confirmText: isActive
        ? 'Desactivar'
        : 'Activar',
    },
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.toggleStatus(esp);
    }
  });
}

toggleStatus(esp: Specialty): void {
  const isActive = esp.status === 'ACTIVE';

  this.specialtyService.toggleStatus(esp.id).subscribe({
    next: () => {
      this.notification.success(
        `Especialidad ${
          isActive ? 'desactivada' : 'activada'
        } correctamente.`
      );

      this.loadEspecialidades();
    },

    error: () => {
      this.notification.error(
        `No se pudo ${
          isActive ? 'desactivar' : 'activar'
        } la especialidad.`
      );
    },
  });
}

}
