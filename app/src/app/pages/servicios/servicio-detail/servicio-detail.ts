import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicioService } from '../../../core/services/servicio.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-servicio-detail',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.css',
})
export class ServicioDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly servicioService = inject(ServicioService);

  servicio = signal<Service | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('El identificador del servicio no es válido.');
      return;
    }
    this.loadServicio(id);
  }

  loadServicio(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicioService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.servicio.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el detalle del servicio.');
        this.loading.set(false);
      },
    });
  }

  getImageUrl(imageName: string): string {
    return this.servicioService.getImageUrl(imageName);
  }
}
