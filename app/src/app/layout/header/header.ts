import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Role } from '../../core/models/role.model'
import { AuthService } from '../../core/services/auth.service';



interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

interface User {
  nombre: string;
  role: Role;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService)
  readonly publicMenu = input<MenuItem[]>([])
  readonly adminMaintenanceMenu = input<MenuItem[]>([])
  readonly adminManagementMenu = input<MenuItem[]>([])
  readonly cartCount = input(0)
  readonly user = this.authService.user
  readonly authenticated = this.authService.authenticated
  readonly loadingSession =
    this.authService.loadingSession
  readonly iniciliazedSession =
    this.authService.inicializedSession
  readonly rol = this.authService.rol
  readonly isAdmin = this.authService.isAdmin

  readonly nameRol = computed(() => {
    const rol = this.rol()
    if (rol === Role.ADMIN) {
      return 'Administrator'
    }
    if (rol === Role.PROFESSIONAL) {
      return 'Professional'
    }
    return 'Cliente'
  })

  readonly inciales = computed(() => {
    const name =
      this.user()?.name?.trim()
    if (!name) {
      return 'US'
    }
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) =>
        parte.charAt(0).toUpperCase()
      )
      .join('')
  })

  readonly publicMenuVisible = computed(() =>
    this.publicMenu().filter((item) =>
      this.canShow(item)
    )
  )
  /*
   * Elementos administrativos de mantenimiento
   * permitidos para el rol actual.
   */
  readonly adminMaintenanceMenuVisible =
    computed(() =>
      this.adminMaintenanceMenu().filter(
        (item) => this.canShow(item)
      )
    )
  /*
   * Elementos administrativos de gestión
   * permitidos para el rol actual.
   */
  readonly adminManagementMenuVisible =
    computed(() =>
      this.adminManagementMenu().filter(
        (item) => this.canShow(item)
      )
    )
  /*
   * Indica si existe al menos una opción visible
   * en el menú de mantenimientos.
   */
  readonly showMenuMantenimientos =
    computed(
      () =>
        this.adminMaintenanceMenuVisible()
          .length > 0
    )
  /*
   * Indica si existe al menos una opción visible
   * en el menú de gestión.
   */
  readonly showMenuGestion =
    computed(
      () =>
        this.adminManagementMenuVisible()
          .length > 0
    )
  canShow(item: MenuItem): boolean {
    if (!item.roles?.length) {
      return true
    }
    return this.authService.hasRol(
      item.roles
    )
  }
  closeSession(): void {
    this.authService.logout()
  }



}
