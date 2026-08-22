import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-motivo-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
    templateUrl: './motivo-dialog.html',
    styleUrl: './motivo-dialog.css'
})
export class MotivoDialog {
    motivo = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { titulo: string; mensaje: string },
        private dialogRef: MatDialogRef<MotivoDialog>
    ) {}

    confirmar(): void {
        if (this.motivo.trim()) {
            this.dialogRef.close(this.motivo.trim());
        }
    }
}