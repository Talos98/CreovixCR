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
        email?: string;
        role?: string;
        status?: string;
    };
}

export interface ProfessionalDetail extends ProfessionalProfile {
    user: {
        id: number;
        name: string;
        lastName: string;
        services: ProfessionalService[];
    };
}

export interface ProfessionalService {
    id: number;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    mode: 'ONLINE' | 'IN_PERSON';

    category: {
        id: number;
        name: string;
    };

    specialties: {
        id: number;
        name: string;
    }[];
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

export interface ProfessionalUpdateResponse {
    user: ProfessionalProfile['user'];
    profile: ProfessionalProfile;
}

