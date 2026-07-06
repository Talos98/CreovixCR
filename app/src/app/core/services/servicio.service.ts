import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Service, ServiceCreateDto, ServiceUpdateDto } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/service`;

    listar() {
        return this.http.get<ApiPaginatedResponse<Service>>(this.apiUrl);
    }

    obtenerPorId(id: number) {
        return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/${id}`);
    }

    crear(data: ServiceCreateDto) {
        return this.http.post<ApiResponse<Service>>(this.apiUrl, data);
    }

    actualizar(id: number, data: ServiceUpdateDto) {
        return this.http.put<ApiResponse<Service>>(`${this.apiUrl}/${id}`, data);
    }

    toggleStatus(id: number) {
        return this.http.patch<ApiResponse<Service>>(`${this.apiUrl}/${id}/status`, {});
    }

    getImageUrl(imageName: string): string {
        return `${environment.imageUrl}/${imageName}`;
    }
}
