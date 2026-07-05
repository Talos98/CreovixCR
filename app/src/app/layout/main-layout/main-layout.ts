import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

type Role = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

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
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUser = signal<User | null>(null);

  publicMenu = signal<MenuItem[]>([
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Servicios', path: '/servicios', icon: 'work' },
    { label: 'Mis citas', path: '/citas', icon: 'calendar_today', roles: ['CLIENT', 'PROFESSIONAL', 'ADMIN'] },
  ]);

  adminMaintenanceMenu = signal<MenuItem[]>([
    { label: 'Servicios', path: '/admin/servicios', icon: 'work' },
    { label: 'Profesionales', path: '/admin/profesionales', icon: 'person' },
    { label: 'Categorías', path: '/admin/categorias', icon: 'category' },
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'school' },
  ]);

  adminManagementMenu = signal<MenuItem[]>([
    { label: 'Citas', path: '/admin/citas', icon: 'calendar_today' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'group' },
    { label: 'Reseñas', path: '/admin/resenas', icon: 'star' },
  ]);

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }

  loginAsClient(): void {
    this.currentUser.set({ nombre: 'Cliente Demo', role: 'CLIENT' });
  }

  loginAsAdmin(): void {
    this.currentUser.set({ nombre: 'Admin Demo', role: 'ADMIN' });
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
