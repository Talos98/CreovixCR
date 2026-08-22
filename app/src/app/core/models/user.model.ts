export enum Role {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
    PROFESSIONAL = 'PROFESSIONAL',
}


export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    role: Role;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    updatedAt?: string;
    professionalProfile?: ProfessionalProfile;
}

export interface ProfessionalProfile {
    id: number;
    userId: number;
    title: string;
    description?: string;
    yearsExperience: number;
    phone: string;
    location: string;
    baseRate: number;
    mode: 'ONLINE' | 'IN_PERSON';
    isAvailable: boolean;
    profileImage: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResult {
    token: string;
}

export interface RegisterRequest {
    name: string;
    email:string;
    password: string;
}