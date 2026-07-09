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
    user?: { 
        id: number;
        name: string;
        lastName: string;
        email: string;
        role: string;
        status: string };
}

export interface ProfessionalFormModel {
    
    name: string;
    lastName: string;
    email: string;

    title: string;
    description: string;
    yearsExperience: number;
    phone: string;
    location: string;
    baseRate: number;
    mode: 'ONLINE' | 'IN_PERSON';
    isAvailable: boolean;
    profileImage: string;
}

export interface ProfessionalCreateDto {
    
    name: string;
    lastName: string;
    email: string;

    title: string;
    description: string;
    yearsExperience: number;
    phone: string;
    location: string;
    baseRate: number;
    mode: 'ONLINE' | 'IN_PERSON';
    isAvailable: boolean;
    profileImage: string;
}

export type ProfessionalUpdateDto = Partial<ProfessionalCreateDto>;

