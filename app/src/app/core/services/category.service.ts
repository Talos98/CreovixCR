import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Category } from '../models/category.model';

interface CategoryListResponse {
    success: boolean;
    data: Category[];
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/category`;

    listar() {
        return this.http.get<CategoryListResponse>(this.apiUrl);
    }

    toggleStatus(id: number) {
        return this.http.patch<{ success: boolean; data: Category }>(`${this.apiUrl}/${id}/status`, {});
    }
}
