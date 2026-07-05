import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Appointment, AppointmentCreateDto } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/appointment`;

    listar() {
        return this.http.get<ApiPaginatedResponse<Appointment>>(this.apiUrl);
    }

    obtenerPorId(id: number) {
        return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`);
    }

    crear(data: AppointmentCreateDto) {
        return this.http.post<ApiResponse<Appointment>>(this.apiUrl, data);
    }
}
