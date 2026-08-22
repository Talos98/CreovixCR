import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormField, form, required, minLength } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentService } from '../../../core/services/appointment.service';
import { UserService } from '../../../core/services/user.service';
import { ServicioService } from '../../../core/services/servicio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models/user.model';
import { Service } from '../../../core/models/service.model';
import { AppointmentCreateDto, AppointmentFormModel } from '../../../core/models/appointment.model';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/role.model';

type FieldStateLike = {
    errors?: any[];
    setErrors: (errors: any[]) => void;
};

@Component({
    selector: 'app-cita-create-page',
    standalone: true,
    imports: [
        CommonModule,
        FormField,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './cita-create-page.html',
    styleUrl: './cita-create-page.css',
})
export class CitaCreatePage {
    private readonly router = inject(Router);
    private readonly appointmentService = inject(AppointmentService);
    private readonly userService = inject(UserService);
    private readonly servicioService = inject(ServicioService);
    private readonly noti = inject(NotificationService);
    protected readonly authService = inject(AuthService);
    readonly rol = this.authService.rol;
    readonly Role = Role;

    clients = signal<User[]>([]);
    professionals = signal<User[]>([]);
    services = signal<Service[]>([]);
    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);

    // Servicio seleccionado actualmente
    selectedService = computed(() => {
        const id = this.citaModel().serviceId;
        if (!id) return null;
        return this.services().find(s => s.id === id) ?? null;
    });

    // Hora final calculada automáticamente
    calculatedEndTime = computed(() => {
        const start = this.citaModel().startTime;
        const service = this.selectedService();
        if (!start || !service) return '';

        const [hours, minutes] = start.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + service.duration;
        const endH = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const endM = (totalMinutes % 60).toString().padStart(2, '0');
        return `${endH}:${endM}`;
    });

    // Monto estimado del servicio
    montoEstimado = computed(() => {
        return this.selectedService()?.price ?? null;
    });

    // Servicios filtrados por profesional seleccionado
    filteredServices = computed(() => {
        const profId = this.citaModel().professionalId;
        if (!profId) return this.services();
        return this.services().filter(s => s.professionalId === profId);
    });

    citaModel = signal<AppointmentFormModel>({
        clientId: null,
        professionalId: null,
        serviceId: null,
        date: '',
        startTime: '',
        endTime: '',
        mode: 'IN_PERSON',
        description: '',
    });

    citaForm = form(this.citaModel, (path) => {
        required(path.clientId, { message: 'Seleccione un cliente' });
        required(path.professionalId, { message: 'Seleccione un profesional' });
        required(path.serviceId, { message: 'Seleccione un servicio' });
        required(path.date, { message: 'La fecha es obligatoria' });
        required(path.startTime, { message: 'La hora es obligatoria' });
        required(path.mode, { message: 'Seleccione una modalidad' });
        minLength(path.description, 5, { message: 'La descripcion debe tener al menos 5 caracteres' });
    });

    constructor() {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.loading.set(true);
        this.error.set(null);

        forkJoin({
            users: this.userService.listar(),
            services: this.servicioService.listar(),
        }).subscribe({
            next: ({ users, services }) => {
                const allUsers = users.data ?? [];
                this.clients.set(allUsers.filter((u) => u.role === 'CLIENT'));
                // Si es CLIENT, auto-asignar su propio ID
                const currentUser = this.authService.user();
                if (currentUser?.role === 'CLIENT') {
                    this.citaModel.update(m => ({ ...m, clientId: currentUser.id }));
                }
                //valida si el profesional está disponible
                this.professionals.set(
                    allUsers.filter((u) => u.role === 'PROFESSIONAL' && u.status === 'ACTIVE' && u.professionalProfile?.isAvailable)
                );
                //valida si el servicio está activo
                this.services.set((services.data ?? []).filter(s => s.status === 'ACTIVE'));
            },
            error: () => {
                this.error.set('No se pudieron cargar los datos del formulario');
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    submit(): void {
        if (this.saving()) return;

        this.marcarCamposComoTocados();
        if (this.formularioInvalido()) return;

        this.saving.set(true);
        this.error.set(null);

        const value = this.citaModel();

        const dto: AppointmentCreateDto = {
            clientId: Number(value.clientId),
            professionalId: Number(value.professionalId),
            serviceId: Number(value.serviceId),
            date: value.date,
            startTime: value.startTime,
            endTime: this.calculatedEndTime(),
            mode: value.mode,
            description: value.description.trim(),
        };

        this.appointmentService.crear(dto).subscribe({
            next: () => {
                this.saving.set(false);
                this.noti.success('Cita registrada correctamente');
                if (this.rol() === Role.CLIENT) {
                    this.router.navigate(['/citas']);
                } else {
                    this.router.navigate(['/admin/citas']);
                }
            },

            error: (err) => {
                this.saving.set(false);


                const backendMessage = err?.error?.message;
                this.error.set(backendMessage || 'No se pudo registrar la cita');


                const validationErrors = err?.error?.validationErrors;

                if (validationErrors && Array.isArray(validationErrors)) {
                    validationErrors.forEach((e: any) => {
                        const fieldName = e.field as keyof typeof this.citaForm;
                        const field = this.citaForm[fieldName];

                        if (field && typeof field === 'function') {

                            const fieldState = field() as unknown as FieldStateLike;
                            const currentErrors = fieldState.errors ?? [];

                            fieldState.setErrors([
                                ...currentErrors,
                                { message: e.message }
                            ]);
                        }
                    });
                }
            }
        });
    }

    cancelar(): void {
        if (this.rol() === Role.CLIENT) {
            this.router.navigate(['/citas']);
        } else {
            this.router.navigate(['/admin/citas']);
        }
    }

    private marcarCamposComoTocados(): void {
        this.citaForm.clientId().markAsTouched();
        this.citaForm.professionalId().markAsTouched();
        this.citaForm.serviceId().markAsTouched();
        this.citaForm.date().markAsTouched();
        this.citaForm.startTime().markAsTouched();
        this.citaForm.mode().markAsTouched();
        this.citaForm.description().markAsTouched();
    }

    private formularioInvalido(): boolean {
        return (
            this.citaForm.clientId().invalid() ||
            this.citaForm.professionalId().invalid() ||
            this.citaForm.serviceId().invalid() ||
            this.citaForm.date().invalid() ||
            this.citaForm.startTime().invalid() ||
            this.citaForm.mode().invalid() ||
            this.citaForm.description().invalid()
        );
    }
}