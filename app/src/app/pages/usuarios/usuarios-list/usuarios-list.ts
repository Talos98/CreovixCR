import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuarios-list',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  usuarios = signal<User[]>([]);
  search = signal('');
  roleFilter = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  usuariosFiltrados = computed(() => {
    let list = this.usuarios();
    const searchTerm = this.search().toLowerCase().trim();
    const role = this.roleFilter();

    if (searchTerm) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm) ||
          u.email.toLowerCase().includes(searchTerm)
      );
    }

    if (role) {
      list = list.filter((u) => u.role === role);
    }

    return list;
  });

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.listar().subscribe({
      next: (response) => {
        this.usuarios.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los usuarios.');
        this.loading.set(false);
      },
    });
  }

  openConfirmDialog(user: User): void {
    const isActive = user.status === 'ACTIVE';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: isActive ? 'Desactivar usuario' : 'Activar usuario',
        message: `¿Deseas ${isActive ? 'desactivar' : 'activar'} a ${user.name} ${user.lastName}?`,
        warning: isActive
          ? 'El usuario perderá acceso al sistema.'
          : 'El usuario podrá acceder nuevamente.',
        confirmText: isActive ? 'Desactivar' : 'Activar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toggleStatus(user);
      }
    });
  }

  toggleStatus(user: User): void {
    const isActive = user.status === 'ACTIVE';

    this.userService.toggleStatus(user.id).subscribe({
      next: () => {
        this.notificationService.success(
          `Usuario ${isActive ? 'desactivado' : 'activado'} correctamente.`
        );
        this.loadUsuarios();
      },
      error: () => {
        this.notificationService.error(
          `No se pudo ${isActive ? 'desactivar' : 'activar'} al usuario.`
        );
      },
    });
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      PROFESSIONAL: 'Profesional',
      CLIENT: 'Cliente',
    };
    return labels[role] || role;
  }
}
