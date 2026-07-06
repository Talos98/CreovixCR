import {
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormField,
  form,
  required,
  min,
  minLength,
  maxLength,
  validate
} from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  Service,
  ServiceCreateDto,
  ServiceFormModel,
  ServiceUpdateDto
} from '../../../core/models/service.model';
import { Category } from '../../../core/models/category.model';
import { Specialty } from '../../../core/models/specialty.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-servicio-form',
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
    MatCheckboxModule
  ],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css'
})
export class ServicioForm {
  servicio = input<Service | null>(null);
  saving = input<boolean>(false);
  categorias = input<Category[]>([]);
  especialidades = input<Specialty[]>([]);
  profesionales = input<User[]>([]);
  guardar = output<ServiceCreateDto | ServiceUpdateDto>();
  cancelar = output<void>();

  servicioModel = signal<ServiceFormModel>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    mode: 'IN_PERSON',
    status: true,
    categoryId: null,
    professionalId: null,
    specialtyIds: []
  });

  servicioForm = form(this.servicioModel, (path) => {
    required(path.name, {
      message: 'El nombre es obligatorio'
    });
    minLength(path.name, 3, {
      message: 'Mínimo 3 caracteres'
    });
    maxLength(path.name, 100, {
      message: 'Máximo 100 caracteres'
    });

    required(path.description, {
      message: 'La descripción es obligatoria'
    });
    minLength(path.description, 10, {
      message: 'La descripción debe tener mínimo 10 caracteres'
    });
    maxLength(path.description, 255, {
      message: 'Máximo 255 caracteres'
    });

    required(path.price, {
      message: 'El precio es obligatorio'
    });
    min(path.price, 1, {
      message: 'El precio debe ser mayor a 0'
    });

    required(path.duration, {
      message: 'La duración es obligatoria'
    });
    min(path.duration, 1, {
      message: 'La duración debe ser mayor a 0'
    });

    required(path.categoryId, {
      message: 'Seleccione una categoría'
    });

    required(path.professionalId, {
      message: 'Seleccione un profesional'
    });

    validate(path.specialtyIds, (ctx) => {
      const ids = ctx.value();
      if (!ids || ids.length === 0) {
        return {
          kind: 'especialidadRequerida',
          message: 'Seleccione al menos una especialidad'
        };
      }
      return undefined;
    });
  });

  selectedSpecialtyIds = signal<number[]>([]);

  isEdit = computed(() => this.servicio() !== null);
  isSubmitting = computed(() => this.saving());

  constructor() {
    // Cargar datos del servicio en modo edición
    const srv = this.servicio();
    if (srv) {
      this.loadServicio(srv);
    }
  }

  ngOnChanges(): void {
    const srv = this.servicio();
    if (srv) {
      this.loadServicio(srv);
    }
  }

  private loadServicio(srv: Service) {
    const ids = srv.specialties?.map((s) => s.id) ?? [];
    this.selectedSpecialtyIds.set(ids);
    this.servicioModel.set({
      name: srv.name,
      description: srv.description ?? '',
      price: srv.price,
      duration: srv.duration,
      mode: srv.mode,
      status: srv.status === 'ACTIVE',
      categoryId: srv.categoryId,
      professionalId: srv.professionalId,
      specialtyIds: ids
    });
  }

  toggleEspecialidad(id: number, checked: boolean) {
    this.selectedSpecialtyIds.update((ids) =>
      checked
        ? Array.from(new Set([...ids, id]))
        : ids.filter((item) => item !== id)
    );
    this.servicioForm.specialtyIds().markAsTouched();
  }

  isEspecialidadSelected(id: number): boolean {
    return this.selectedSpecialtyIds().includes(id);
  }

  submit() {
    if (this.isSubmitting()) return;
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;

    const dto = this.buildDto();
    console.log('JSON enviado al API:', dto);
    this.guardar.emit(dto);
  }

  private marcarCamposComoTocados() {
    this.servicioForm.name().markAsTouched();
    this.servicioForm.description().markAsTouched();
    this.servicioForm.price().markAsTouched();
    this.servicioForm.duration().markAsTouched();
    this.servicioForm.categoryId().markAsTouched();
    this.servicioForm.professionalId().markAsTouched();
    this.servicioForm.specialtyIds().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.servicioForm.name().invalid() ||
      this.servicioForm.description().invalid() ||
      this.servicioForm.price().invalid() ||
      this.servicioForm.duration().invalid() ||
      this.servicioForm.categoryId().invalid() ||
      this.servicioForm.professionalId().invalid() ||
      this.servicioForm.specialtyIds().invalid()
    );
  }

  private buildDto(): ServiceCreateDto | ServiceUpdateDto {
    const value = this.servicioModel();
    return {
      name: value.name.trim(),
      description: value.description.trim(),
      price: Number(value.price),
      duration: Number(value.duration),
      mode: value.mode,
      status: value.status ? 'ACTIVE' : 'INACTIVE',
      categoryId: Number(value.categoryId),
      professionalId: Number(value.professionalId),
      specialtyIds: this.selectedSpecialtyIds()
    };
  }
}
