import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Specialty } from '../models/specialty.model';

interface SpecialtyListResponse {
    success: boolean;
    data: Specialty[];
}

@Injectable({ providedIn: 'root' })
export class SpecialtyService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/specialty`;

    listar() {
        return this.http.get<SpecialtyListResponse>(this.apiUrl);
    }

    toggleStatus(id: number) {
        return this.http.patch<{ success: boolean; data: Specialty }>(`${this.apiUrl}/${id}/status`, {});
    }
}
