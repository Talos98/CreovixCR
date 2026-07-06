export interface Category {
    id: number;
    name: string;
    description?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    updatedAt?: string;
}
