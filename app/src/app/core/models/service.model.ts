import { Category } from './category.model';
import { Specialty } from './specialty.model';
import { User } from './user.model';

export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration: number;
    mode: 'ONLINE' | 'IN_PERSON';
    status: 'ACTIVE' | 'INACTIVE';
    professionalId: number;
    categoryId: number;
    professional?: User;
    category?: Category;
    specialties?: Specialty[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceFormModel {
    name: string;
    description: string;
    price: number;
    duration: number;
    mode: 'ONLINE' | 'IN_PERSON';
    status: boolean;
    categoryId: number | null;
    professionalId: number | null;
    specialtyIds: number[];
}

export interface ServiceCreateDto {
    name: string;
    description: string;
    price: number;
    duration: number;
    mode: 'ONLINE' | 'IN_PERSON';
    status: 'ACTIVE' | 'INACTIVE';
    categoryId: number;
    professionalId: number;
    specialtyIds: number[];
}

export interface ServiceUpdateDto {
    name: string;
    description: string;
    price: number;
    duration: number;
    mode: 'ONLINE' | 'IN_PERSON';
    status: 'ACTIVE' | 'INACTIVE';
    categoryId: number;
    professionalId: number;
    specialtyIds: number[];
}
