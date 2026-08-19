import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';
import { Review, ReviewCreateDto } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/review`;

    crear(data: ReviewCreateDto) {
        return this.http.post<ApiResponse<Review>>(this.apiUrl, data);
    }
}
