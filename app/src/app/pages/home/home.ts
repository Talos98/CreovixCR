import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ContentCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios',
      description: 'Explora el catálogo de servicios profesionales, categorías y especialidades.',
      icon: 'work',
    },
    {
      title: 'Citas',
      description: 'Agenda y gestiona citas con profesionales de tu preferencia.',
      icon: 'calendar_today',
    },
    {
      title: 'Usuarios',
      description: 'Gestión de usuarios, roles y perfiles profesionales.',
      icon: 'group',
    },
  ]);
}
