import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Role } from '../../core/models/role.model'

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

  publicMenu = signal<MenuItem[]>([
    {
      label: 'Inicio',
      path: '/',
      icon: 'home'
    },
    {
      label: 'Servicios',
      path: '/servicios',
      icon: 'work'
    },
    {
      label: 'Mis citas',
      path: '/citas',
      icon: 'calendar_today',
      roles: [
        Role.PROFESSIONAL,
        Role.CLIENT]
    },
    {
      label: 'Mis servicios',
      path: '/mis-servicios',
      icon: 'work_outline',
      roles: [Role.PROFESSIONAL]
    },
    {
      label: 'Mi perfil profesional',
      path: '/mi-perfil-profesional',
      icon: 'badge',
      roles: [Role.PROFESSIONAL]
    },
    {
      label: 'Mis reportes',
      path: '/mis-reportes',
      icon: 'bar_chart',
      roles: [Role.PROFESSIONAL]
    },
  ]);

  adminMaintenanceMenu = signal<MenuItem[]>([
    {
      label: 'Servicios',
      path: '/admin/servicios',
      icon: 'work',
      roles: [Role.ADMIN]
    },
    {
      label: 'Profesionales',
      path: '/admin/profesionales',
      icon: 'person',
      roles: [Role.ADMIN]
    },
    {
      label: 'Categorías',
      path: '/admin/categorias',
      icon: 'category',
      roles: [Role.ADMIN]
    },
    {
      label: 'Especialidades',
      path: '/admin/especialidades',
      icon: 'school',
      roles: [Role.ADMIN]
    },
  ]);

  adminManagementMenu = signal<MenuItem[]>([
    {
      label: 'Citas',
      path: '/admin/citas',
      icon: 'calendar_today',
      roles: [Role.ADMIN]
    },
    {
      label: 'Usuarios',
      path: '/admin/usuarios',
      icon: 'group',
      roles: [Role.ADMIN]
    },
    {
      label: 'Reportes',
      path: '/admin/reportes',
      icon: 'bar_chart',
      roles: [Role.ADMIN]
    },
  ]);
}