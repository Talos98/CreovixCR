import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ServicioService } from '../../../core/services/servicio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
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
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
    const params = this.route.snapshot.queryParams;
    if (params['search']) this.search.set(params['search']);
    if (params['categoriaFilter']) this.categoriaFilter.set(Number(params['categoriaFilter']));
    if (params['mode']) this.modeFilter.set(params['mode']);
    if (params['priceMin']) this.priceMin.set(Number(params['priceMin']));
    if (params['priceMax']) this.priceMax.set(Number(params['priceMax']));

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
  openStatusDialog(srv: Service): void {
    const isActive = srv.status === 'ACTIVE';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: isActive
          ? 'Desactivar servicio'
          : 'Activar servicio',

        message: `¿Deseas ${isActive ? 'desactivar' : 'activar'
          } el servicio "${srv.name}"?`,

        warning: isActive
          ? 'El servicio dejará de estar disponible para los usuarios.'
          : 'El servicio volverá a estar disponible para solicitudes.',

        confirmText: isActive
          ? 'Desactivar'
          : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toggleStatus(srv);
      }
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.categoriaFilter.set(null);
    this.modeFilter.set(null);
    this.priceMin.set(null);
    this.priceMax.set(null);

    this.syncQueryParams();
  }

  toggleStatus(srv: Service): void {
    const isActive = srv.status === 'ACTIVE';

    this.servicioService.toggleStatus(srv.id).subscribe({
      next: () => {
        this.noti.success(
          `Servicio ${isActive ? 'desactivado' : 'activado'
          } correctamente`
        );

        this.loadServicios();
      },

      error: () => {
        this.noti.error(
          'No se pudo cambiar el estado del servicio'
        );
      },
    });
  }

  protected syncQueryParams(): void {
    const params: any = {};
    if (this.search()) params.search = this.search();
    if (this.categoriaFilter() !== null) params.categoriaFilter = this.categoriaFilter();
    if (this.modeFilter() !== null) params.mode = this.modeFilter();
    if (this.priceMin() !== null) params.priceMin = this.priceMin();
    if (this.priceMax() !== null) params.priceMax = this.priceMax();

    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }  

}
