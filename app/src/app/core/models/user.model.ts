export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    updatedAt?: string;
}
