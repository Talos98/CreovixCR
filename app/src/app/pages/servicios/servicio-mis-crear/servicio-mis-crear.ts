import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { ServicioService } from '../../../core/services/servicio.service';
import { CategoryService } from '../../../core/services/category.service';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models/category.model';
import { Specialty } from '../../../core/models/specialty.model';
import { User } from '../../../core/models/user.model';
import { ServiceCreateDto, ServiceUpdateDto } from '../../../core/models/service.model';

@Component({
    selector: 'app-servicio-mis-crear',
    standalone: true,
    imports: [ServicioForm, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
    templateUrl: './servicio-mis-crear.html',
})
export class ServicioMisCrear {
    private readonly router = inject(Router);
    private readonly servicioService = inject(ServicioService);
    private readonly categoriaService = inject(CategoryService);
    private readonly especialidadService = inject(SpecialtyService);
    private readonly authService = inject(AuthService);
    private readonly noti = inject(NotificationService);

    categorias = signal<Category[]>([]);
    especialidades = signal<Specialty[]>([]);
    profesionales = signal<User[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    constructor() {
        this.cargarDatosFormulario();
    }

    cargarDatosFormulario() {
        this.loading.set(true);
        this.error.set(null);

        forkJoin({
            categorias: this.categoriaService.listar(),
            especialidades: this.especialidadService.listar(),
        }).subscribe({
            next: ({ categorias, especialidades }) => {
                this.categorias.set(categorias.data ?? []);
                this.especialidades.set(especialidades.data ?? []);
                const user = this.authService.user();
                if (user) {
                    this.profesionales.set([user]);
                }
            },
            error: () => {
                this.error.set('No se pudieron cargar los datos del formulario');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    guardar(data: ServiceCreateDto | ServiceUpdateDto) {
        this.saving.set(true);
        this.error.set(null);

        const user = this.authService.user();
        const dto = { ...data, professionalId: user!.id } as ServiceCreateDto;

        this.servicioService.crear(dto).subscribe({
            next: () => {
                this.noti.success('Servicio registrado correctamente');
                this.router.navigate(['/mis-servicios']);
            },
            error: () => {
                this.error.set('No se pudo registrar el servicio');
                this.saving.set(false);
            },
        });
    }

    cancelar() {
        this.router.navigate(['/mis-servicios']);
    }
}
