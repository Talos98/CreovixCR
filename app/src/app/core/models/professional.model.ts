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
    user?: { id: number; name: string; email: string; role: string; status: string };
}

export interface ProfessionalFormModel {
    userId: number | null;
    title: string;
    description: string;
    yearsExperience: number;
    phone: string;
    location: string;
    baseRate: number;
    mode: 'ONLINE' | 'IN_PERSON';
    isAvailable: boolean;
}

export interface ProfessionalCreateDto {
    userId: number;
    title: string;
    description: string;
    yearsExperience: number;
    phone: string;
    location: string;
    baseRate: number;
    mode: 'ONLINE' | 'IN_PERSON';
    isAvailable: boolean;
}

export type ProfessionalUpdateDto = Omit<ProfessionalCreateDto, 'userId'>;
