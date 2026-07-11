import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-categoria-admin-list',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './categoria-admin-list.html',
  styleUrl: './categoria-admin-list.css',
})
export class CategoriaAdminList {
  private readonly categoryService = inject(CategoryService);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  categorias = signal<Category[]>([]);
  search = signal('');
  statusFilter = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['name', 'status', 'actions'];

  categoriasFiltradas = computed(() => {
    let result = this.categorias();
    const searchTerm = this.search().toLowerCase().trim();
    const status = this.statusFilter();

    if (searchTerm) {
      result = result.filter(c => c.name.toLowerCase().includes(searchTerm));
    }
    if (status) {
      result = result.filter(c => c.status === status);
    }
    return result;
  });

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.listar().subscribe({
      next: (response) => {
        this.categorias.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías.');
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

  openStatusDialog(cat: Category): void {
    const isActive = cat.status === 'ACTIVE';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: isActive
          ? 'Desactivar categoría'
          : 'Activar categoría',

        message: `¿Deseas ${isActive ? 'desactivar' : 'activar'
          } la categoría "${cat.name}"?`,

        warning: isActive
          ? 'La categoría dejará de estar disponible para nuevos servicios.'
          : 'La categoría volverá a estar disponible para nuevos servicios.',

        confirmText: isActive
          ? 'Desactivar'
          : 'Activar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toggleStatus(cat);
      }
    });
  }

  toggleStatus(cat: Category): void {
    const isActive = cat.status === 'ACTIVE';

    this.categoryService.toggleStatus(cat.id).subscribe({
      next: () => {
        this.notification.success(
          `Categoría ${isActive ? 'desactivada' : 'activada'
          } correctamente.`
        );

        this.loadCategorias();
      },

      error: () => {
        this.notification.error(
          `No se pudo ${isActive ? 'desactivar' : 'activar'
          } la categoría.`
        );
      },
    });
  }
}
