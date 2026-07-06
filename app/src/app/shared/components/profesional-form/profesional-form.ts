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
} from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    ProfessionalProfile,
    ProfessionalCreateDto,
    ProfessionalUpdateDto,
    ProfessionalFormModel
} from '../../../core/models/professional.model';

interface UserOption {
    id: number;
    name: string;
    email: string;
}

@Component({
    selector: 'app-profesional-form',
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
    templateUrl: './profesional-form.html',
    styleUrl: './profesional-form.css'
})
export class ProfesionalForm {
    profesional = input<ProfessionalProfile | null>(null);
    saving = input<boolean>(false);
    usuarios = input<UserOption[]>([]);
    guardar = output<ProfessionalCreateDto | ProfessionalUpdateDto>();
    cancelar = output<void>();

    profesionalModel = signal<ProfessionalFormModel>({
        userId: null,
        title: '',
        description: '',
        yearsExperience: 0,
        phone: '',
        location: '',
        baseRate: 0,
        mode: 'IN_PERSON',
        isAvailable: true
    });

    profesionalForm = form(this.profesionalModel, (path) => {
        required(path.userId, {
            message: 'Seleccione un usuario'
        });

        required(path.title, {
            message: 'El titulo es obligatorio'
        });
        minLength(path.title, 3, {
            message: 'Minimo 3 caracteres'
        });
        maxLength(path.title, 100, {
            message: 'Maximo 100 caracteres'
        });

        maxLength(path.description, 500, {
            message: 'Maximo 500 caracteres'
        });

        required(path.yearsExperience, {
            message: 'Los anos de experiencia son obligatorios'
        });
        min(path.yearsExperience, 0, {
            message: 'Debe ser 0 o mayor'
        });

        required(path.phone, {
            message: 'El telefono es obligatorio'
        });

        required(path.location, {
            message: 'La ubicacion es obligatoria'
        });

        required(path.baseRate, {
            message: 'La tarifa base es obligatoria'
        });
        min(path.baseRate, 1, {
            message: 'La tarifa debe ser mayor a 0'
        });

        required(path.mode, {
            message: 'La modalidad es obligatoria'
        });
    });

    isEdit = computed(() => this.profesional() !== null);
    isSubmitting = computed(() => this.saving());

    constructor() {
        const prof = this.profesional();
        if (prof) {
            this.loadProfesional(prof);
        }
    }

    ngOnChanges(): void {
        const prof = this.profesional();
        if (prof) {
            this.loadProfesional(prof);
        }
    }

    private loadProfesional(prof: ProfessionalProfile) {
        this.profesionalModel.set({
            userId: prof.userId,
            title: prof.title,
            description: prof.description ?? '',
            yearsExperience: prof.yearsExperience,
            phone: prof.phone,
            location: prof.location,
            baseRate: prof.baseRate,
            mode: prof.mode,
            isAvailable: prof.isAvailable
        });
    }

    submit() {
        if (this.isSubmitting()) return;
        this.marcarCamposComoTocados();
        if (this.formularioInvalido()) return;

        const dto = this.buildDto();
        this.guardar.emit(dto);
    }

    private marcarCamposComoTocados() {
        if (!this.isEdit()) {
            this.profesionalForm.userId().markAsTouched();
        }
        this.profesionalForm.title().markAsTouched();
        this.profesionalForm.description().markAsTouched();
        this.profesionalForm.yearsExperience().markAsTouched();
        this.profesionalForm.phone().markAsTouched();
        this.profesionalForm.location().markAsTouched();
        this.profesionalForm.baseRate().markAsTouched();
        this.profesionalForm.mode().markAsTouched();
    }

    private formularioInvalido(): boolean {
        const userIdInvalid = !this.isEdit() && this.profesionalForm.userId().invalid();
        return (
            userIdInvalid ||
            this.profesionalForm.title().invalid() ||
            this.profesionalForm.yearsExperience().invalid() ||
            this.profesionalForm.phone().invalid() ||
            this.profesionalForm.location().invalid() ||
            this.profesionalForm.baseRate().invalid() ||
            this.profesionalForm.mode().invalid()
        );
    }

    private buildDto(): ProfessionalCreateDto | ProfessionalUpdateDto {
        const value = this.profesionalModel();

        if (this.isEdit()) {
            return {
                title: value.title.trim(),
                description: value.description.trim(),
                yearsExperience: Number(value.yearsExperience),
                phone: value.phone.trim(),
                location: value.location.trim(),
                baseRate: Number(value.baseRate),
                mode: value.mode,
                isAvailable: value.isAvailable
            } as ProfessionalUpdateDto;
        }

        return {
            userId: Number(value.userId),
            title: value.title.trim(),
            description: value.description.trim(),
            yearsExperience: Number(value.yearsExperience),
            phone: value.phone.trim(),
            location: value.location.trim(),
            baseRate: Number(value.baseRate),
            mode: value.mode,
            isAvailable: value.isAvailable
        } as ProfessionalCreateDto;
    }
}
