import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ServicioService } from '../../../core/services/servicio.service';
import { Service } from '../../../core/models/service.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-servicios-list',
  imports: [
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList {
  private readonly servicioService = inject(ServicioService);

  servicios = signal<Service[]>([]);
  search = signal('');
  categoriaId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  categorias = computed<Category[]>(() => {
    const map = new Map<number, Category>();
    this.servicios().forEach((srv) => {
      if (srv.category) {
        map.set(srv.category.id, srv.category);
      }
    });
    return Array.from(map.values());
  });

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const categoriaSeleccionada = this.categoriaId();

    return this.servicios().filter((srv) => {
      const nombre = srv.name?.toLowerCase() ?? '';
      const descripcion = srv.description?.toLowerCase() ?? '';
      const categoriaNombre = srv.category?.name?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoriaNombre.includes(texto);

      const coincideCategoria =
        categoriaSeleccionada === null ||
        srv.categoryId === categoriaSeleccionada ||
        srv.category?.id === categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    });
  });

  totalServicios = computed(() => this.serviciosFiltrados().length);

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

  clearFilters(): void {
    this.search.set('');
    this.categoriaId.set(null);
  }

  getImageUrl(imageName: string): string {
    return this.servicioService.getImageUrl(imageName);
  }
}
