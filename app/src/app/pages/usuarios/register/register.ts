import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { RegisterRequest } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        RouterLink,
        FormField,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './register.html',
    styleUrl: './register.css',
})

export class Register {
    private readonly notification = inject(NotificationService);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);

    readonly ocultarPassword = signal(true);
    readonly enviando = signal(false);
    readonly errorServidor = signal<string | null>(null);
    readonly model = signal<RegisterRequest>({
        name: '',
        lastName: '',
        email: '',
        password: '',
    });

    readonly registerForm = form(this.model, (path) => {
        required(path.name, { message: 'El nombre es obligatorio.' });
        required(path.lastName, { message: 'Los apellidos son obligatorios.' });
        email(path.email, { message: 'El correo s obligatorio.' });
        required(path.password, { message: 'La contraseña es obligatoria. ' });
        minLength(path.password, 6, { message: 'La contraseña debe tener al menos 6 caracteres.' });
    });

    submit(): void {
        if (this.registerForm().invalid()) return;

        this.enviando.set(true);
        this.errorServidor.set(null);

        this.userService.registrar(this.model())
            .pipe(finalize(() => this.enviando.set(false)))
            .subscribe({
                next: () => {
                    this.notification.success('Cuenta creada exitosamente. Inicie sesión.');
                    void this.router.navigateByUrl('/login');
                },
                error: (error) => {
                    this.errorServidor.set(                        
                        error.error?.message ?? 'No fue posible crear la cuenta.'
                    );
                },
            });
    }
}