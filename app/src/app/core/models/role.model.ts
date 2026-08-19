export enum Role {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
    PROFESSIONAL = 'PROFESSIONAL',
}

export interface RoleOption {
    value: Role;
    label: string;
}