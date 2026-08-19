export interface Review {
    id: number;
    clientId: number;
    professionalId: number;
    appointmentId: number;
    rating: number;
    comment?: string;
    createdAt?: string;
}

export interface ReviewCreateDto {
    clientId: number;
    professionalId: number;
    appointmentId: number;
    rating: number;
    comment?: string;
}
