import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import {Router} from '@angular/router'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-no-authorization',
    imports: [
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
    ],
    templateUrl: './no-authorization.html',
    styleUrl:'./no-authorization.css',
})
export class NoAuthorization{
    private readonly location = inject(Location);
    private readonly router = inject(Router);

    return(): void {
        this.location.back();
    }
    goToInicio(): void{
        void this.router.navigate(['/inicio']);
    }
}