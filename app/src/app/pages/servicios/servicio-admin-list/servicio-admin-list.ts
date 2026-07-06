import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ServicioService } from '../../../core/services/servicio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Service } from '../../../core/models/service.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-servicio-admin-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './servicio-admin-list.html',
  styleUrl: './servicio-admin-list.css',
})
export class ServicioAdminList {
  private readonly servicioService = inject(ServicioService);
  private readonly noti = inject(NotificationService);

  servicios = signal<Service[]>([]);
  search = signal('');
  categoriaFilter = signal<number | null>(null);
  modeFilter = signal<string | null>(null);
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['name', 'professional', 'category', 'price', 'duration', 'mode', 'status', 'actions'];

  categorias = computed<Category[]>(() => {
    const map = new Map<number, Category>();
    this.servicios().forEach((srv) => {
      if (srv.category) map.set(srv.category.id, srv.category);
    });
    return Array.from(map.values());
  });

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const catId = this.categoriaFilter();
    const mode = this.modeFilter();
    const pMin = this.priceMin();
    const pMax = this.priceMax();

    return this.servicios().filter((srv) => {
      const coincideTexto = !texto || srv.name?.toLowerCase().includes(texto);
      const coincideCategoria = catId === null || srv.categoryId === catId;
      const coincideMode = mode === null || srv.mode === mode;
      const coincidePrecioMin = pMin === null || srv.price >= pMin;
      const coincidePrecioMax = pMax === null || srv.price <= pMax;
      return coincideTexto && coincideCategoria && coincideMode && coincidePrecioMin && coincidePrecioMax;
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
        this.servicios.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }

  toggleStatus(srv: Service): void {
    const action = srv.status === 'ACTIVE' ? 'desactivar' : 'activar';
    if (!confirm(`¿Está seguro de ${action} el servicio "${srv.name}"?`)) return;

    this.servicioService.toggleStatus(srv.id).subscribe({
      next: () => {
        this.noti.success(`Servicio ${action === 'activar' ? 'activado' : 'desactivado'} correctamente`);
        this.loadServicios();
      },
      error: () => this.noti.error('No se pudo cambiar el estado del servicio'),
    });
  }
}
