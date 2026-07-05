import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/user`;

    listar() {
        return this.http.get<ApiPaginatedResponse<User>>(this.apiUrl);
    }

    toggleStatus(id: number) {
        return this.http.patch<{ success: boolean; data: User }>(`${this.apiUrl}/${id}/status`, {});
    }
}
