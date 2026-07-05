import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { ProfessionalProfile, ProfessionalCreateDto, ProfessionalUpdateDto } from '../models/professional.model';

@Injectable({ providedIn: 'root' })
export class ProfessionalService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/professionalProfile`;

    listar() {
        return this.http.get<any>(this.apiUrl);
    }

    obtenerPorId(id: number) {
        return this.http.get<ApiResponse<ProfessionalProfile>>(`${this.apiUrl}/${id}`);
    }

    crear(data: ProfessionalCreateDto) {
        return this.http.post<ApiResponse<ProfessionalProfile>>(this.apiUrl, data);
    }

    actualizar(id: number, data: ProfessionalUpdateDto) {
        return this.http.put<ApiResponse<ProfessionalProfile>>(`${this.apiUrl}/${id}`, data);
    }

    toggleAvailability(id: number) {
        return this.http.patch<ApiResponse<ProfessionalProfile>>(`${this.apiUrl}/${id}/availability`, {});
    }

    getImageUrl(imageName: string): string {
        return `${environment.imageUrl}/${imageName}`;
    }
}
