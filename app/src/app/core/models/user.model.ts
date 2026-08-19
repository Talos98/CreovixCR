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