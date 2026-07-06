import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { ServicioService } from '../../../core/services/servicio.service';
import { CategoryService } from '../../../core/services/category.service';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Service, ServiceCreateDto, ServiceUpdateDto } from '../../../core/models/service.model';
import { Category } from '../../../core/models/category.model';
import { Specialty } from '../../../core/models/specialty.model';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-servicio-edit-page',
    standalone: true,
    imports: [ServicioForm, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
    templateUrl: './servicio-edit-page.html',
})
export class ServicioEditPage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly servicioService = inject(ServicioService);
    private readonly categoriaService = inject(CategoryService);
    private readonly especialidadService = inject(SpecialtyService);
    private readonly userService = inject(UserService);
    private readonly noti = inject(NotificationService);

    servicio = signal<Service | null>(null);
    categorias = signal<Category[]>([]);
    especialidades = signal<Specialty[]>([]);
    profesionales = signal<User[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    private readonly id = Number(this.route.snapshot.paramMap.get('id'));

    constructor() {
        this.cargarDatosFormulario();
    }

    cargarDatosFormulario() {
        if (!this.id) {
            this.error.set('El identificador del servicio no es válido');
            this.loading.set(false);
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        forkJoin({
            servicio: this.servicioService.obtenerPorId(this.id),
            categorias: this.categoriaService.listar(),
            especialidades: this.especialidadService.listar(),
            usuarios: this.userService.listar(),
        }).subscribe({
            next: ({ servicio, categorias, especialidades, usuarios }) => {
                this.servicio.set(servicio.data);
                this.categorias.set(categorias.data ?? []);
                this.especialidades.set(especialidades.data ?? []);
                this.profesionales.set((usuarios.data ?? []).filter(u => u.role === 'PROFESSIONAL'));
            },
            error: () => {
                this.error.set('No se pudo cargar la información del servicio');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    guardar(data: ServiceCreateDto | ServiceUpdateDto) {
        if (!this.id) return;

        this.saving.set(true);
        this.error.set(null);

        this.servicioService.actualizar(this.id, data as ServiceUpdateDto).subscribe({
            next: () => {
                this.noti.success('Servicio actualizado correctamente');
                this.router.navigate(['/admin/servicios']);
            },
            error: () => {
                this.error.set('No se pudo actualizar el servicio');
                this.saving.set(false);
            },
        });
    }

    cancelar() {
        this.router.navigate(['/admin/servicios']);
    }
}
