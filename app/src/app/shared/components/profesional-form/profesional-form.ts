import {
    Component,
    computed,
    input,
    output,
    signal,
    inject
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
    FormField,
    form,
    required,
    min,
    minLength,
    maxLength,
    email
} from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
    ProfessionalProfile,
    ProfessionalCreateDto,
    ProfessionalUpdateDto,
    ProfessionalFormModel
} from '../../../core/models/professional.model';

import { ImageService } from '../../../core/services/image.service';

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
        MatCheckboxModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './profesional-form.html',
    styleUrl: './profesional-form.css'
})
export class ProfesionalForm {

    // =====================
    // INPUTS / OUTPUTS
    // =====================
    profesional = input<ProfessionalProfile | null>(null);
    saving = input<boolean>(false);

    guardar = output<ProfessionalCreateDto | ProfessionalUpdateDto>();
    cancelar = output<void>();

    // =====================
    // STATE (SIGNALS)
    // =====================
    profesionalModel = signal<ProfessionalFormModel>({
        name: '',
        lastName: '',
        email: '',
        title: '',
        description: '',
        yearsExperience: 0,
        phone: '',
        location: '',
        baseRate: 0,
        mode: 'IN_PERSON',
        isAvailable: true,
        profileImage: ''
    });

    // =====================
    // FORM
    // =====================
    profesionalForm = form(this.profesionalModel, (path) => {
        required(path.name, {
            message: 'El nombre es obligatorio'
        });

        required(path.lastName, {
            message: 'Los apellidos son obligatorios'
        });

        email(path.email, {
            message: 'El correo es obligatorio'
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
            message: 'Los años de experiencia son obligatorios'
        });
        min(path.yearsExperience, 0, {
            message: 'Debe ser 0 o mayor'
        });

        required(path.phone, {
            message: 'El telefono es obligatorio'
        });

        required(path.location, {
            message: 'La ubicación es obligatoria'
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

    // =====================
    // COMPUTED
    // =====================
    isEdit = computed(() => this.profesional() !== null);
    isSubmitting = computed(() => this.saving());

    // =====================
    // SERVICES
    // =====================
    private readonly imageService = inject(ImageService);

    // =====================
    // IMAGE STATE
    // =====================
    uploadingImage = signal(false);
    imagePreview = signal<string | null>(null);
    selectedImageFile = signal<File | null>(null);

    // =====================
    // LIFECYCLE
    // =====================
    ngOnChanges(): void {
        const prof = this.profesional();
        if (prof) {
            this.loadProfesional(prof);
        }
    }

    // =====================
    // PUBLIC METHODS (UI)
    // =====================
    onImageSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.selectedImageFile.set(file);
        this.imagePreview.set(URL.createObjectURL(file));
    }

    submit() {
        if (this.isSubmitting()) return;
        this.markFieldsAsTouched();
        if (this.isFormInvalid()) return;
        const file = this.selectedImageFile()
        if (file) {
            this.subirImagenYGuardar(file)
            return
        }
        this.emitirGuardar()


    }

    // =====================
    // PRIVATE METHODS
    // =====================
    private loadProfesional(prof: ProfessionalProfile) {
        this.profesionalModel.set({
            name: prof.user?.name ?? '',
            lastName: prof.user?.lastName ?? '',
            email: prof.user?.email ?? '',
            title: prof.title,
            description: prof.description ?? '',
            yearsExperience: prof.yearsExperience,
            phone: prof.phone,
            location: prof.location,
            baseRate: prof.baseRate,
            mode: prof.mode,
            isAvailable: prof.isAvailable,
            profileImage: prof.profileImage ?? ''
        });
    }

    private markFieldsAsTouched() {
        this.profesionalForm.name().markAsTouched();
        this.profesionalForm.lastName().markAsTouched();
        this.profesionalForm.email().markAsTouched();

        this.profesionalForm.title().markAsTouched();
        this.profesionalForm.description().markAsTouched();
        this.profesionalForm.yearsExperience().markAsTouched();
        this.profesionalForm.phone().markAsTouched();
        this.profesionalForm.location().markAsTouched();
        this.profesionalForm.baseRate().markAsTouched();
        this.profesionalForm.mode().markAsTouched();
    }

    private isFormInvalid(): boolean {
        return (
            this.profesionalForm.name().invalid() ||
            this.profesionalForm.lastName().invalid() ||
            this.profesionalForm.email().invalid() ||
            this.profesionalForm.title().invalid() ||
            this.profesionalForm.yearsExperience().invalid() ||
            this.profesionalForm.phone().invalid() ||
            this.profesionalForm.location().invalid() ||
            this.profesionalForm.baseRate().invalid() ||
            this.profesionalForm.mode().invalid()
        );
    }

    private subirImagenYGuardar(file: File) {
        this.uploadingImage.set(true)
        this.imageService.upload(file).subscribe({
            next: (response) => {
                this.profesionalModel.update((value) => ({
                    ...value,
                    profileImage: response.fileName,
                }))
                this.selectedImageFile.set(null)
                this.emitirGuardar()
            },
            error: () => {
                alert('No se pudo subir la imagen')
            },
            complete: () => {
                this.uploadingImage.set(false)
            },
        })
    }

    private emitirGuardar() {
        const dto = this.buildDto()
        console.log('JSON enviado al API:', dto)
        this.guardar.emit(dto)
    }

    private buildDto(): ProfessionalCreateDto | ProfessionalUpdateDto {
        const value = this.profesionalModel();

        return {
            name: value.name.trim(),
            lastName: value.lastName.trim(),
            email: value.email.trim(),
            title: value.title.trim(),
            description: value.description.trim(),
            yearsExperience: Number(value.yearsExperience),
            phone: value.phone.trim(),
            location: value.location.trim(),
            baseRate: Number(value.baseRate),
            mode: value.mode,
            isAvailable: value.isAvailable,
            profileImage: value.profileImage?.trim()
        };
    }
}