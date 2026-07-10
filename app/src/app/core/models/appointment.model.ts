import { User } from './user.model';
import { Service } from './service.model';

export interface Appointment {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    mode: 'ONLINE' | 'IN_PERSON';
    description?: string;
    status: string;
    clientId: number;
    professionalId: number;
    serviceId: number;
    client?: User;
    professional?: User;
    service?: Service;
    createdAt?: string;
}

export interface AppointmentFormModel {
    clientId: number | null;
    professionalId: number | null;
    serviceId: number | null;
    date: string;
    startTime: string;
    endTime: string;
    mode: 'ONLINE' | 'IN_PERSON';
    description: string;
}

export interface AppointmentCreateDto {
    clientId: number;
    professionalId: number;
    serviceId: number;
    date: string;
    startTime: string;
    endTime: string;
    mode: 'ONLINE' | 'IN_PERSON';
    description: string;
}
