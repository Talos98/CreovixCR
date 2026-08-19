import { inject } from '@angular/core';

import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
} from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.model';

export const roleGuard: CanActivateFn =
    (route: ActivatedRouteSnapshot) => {
        const authService =
            inject(AuthService);

        const router =
            inject(Router);

        const allowedRoles =
            route.data['roles'] as
            Role[] | undefined;

        if (!allowedRoles?.length) {
            return true;
        }

        const validateRol = () =>
            authService.hasRol(
                allowedRoles
            )
                ? true
                : router.createUrlTree([
                    '/sin-autorizacion',
                ]);

        if (authService.authenticated()) {
            return validateRol();
        }

        return authService
            .initializeSession()
            .pipe(
                map((usuario) =>
                    usuario
                        ? validateRol()
                        : router.createUrlTree([
                            '/login',
                        ])
                )
            );
    };