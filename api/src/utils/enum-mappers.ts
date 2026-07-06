import { Appointment } from "../../generated/prisma/client";
import { AppointmentStatus, Role, ServiceMode, Status } from "../../generated/prisma/enums";

export interface EnumOption {
    value: string;
    label: string;

}

// Appointment Status

export const AppointmentStatusMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: "Pending",
    [AppointmentStatus.ACCEPTED]: "Accepted",
    [AppointmentStatus.REJECTED]: "Rejected",
    [AppointmentStatus.CANCELLED]: "Cancelled",
    [AppointmentStatus.COMPLETED]: "Completed"

};

// Roles

export const RoleMap: Record<Role, string> = {
    [Role.CLIENT]: "Client",
    [Role.PROFESSIONAL]: "Professional",
    [Role.ADMIN]: "Administrator"

};

//ServiceMode

export const ServiceModeMap: Record<ServiceMode, string> = {
    [ServiceMode.IN_PERSON]: "In person",
    [ServiceMode.ONLINE]: "Online"
};

// Status

export const StausMap: Record<Status, string> = {
    [Status.ACTIVE]: "Active",
    [Status.INACTIVE]: "Inactive"
};

/**
 * 
 *To convert the dictionary of maps in an array of options
 */

export function getEnumOptions<T extends string>(map: Record<T, string>): EnumOption[] {
    return Object.entries(map).map(([value, label]) => ({
        value,
        label: label as string
    }));
}