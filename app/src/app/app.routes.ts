import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { ServicioDetail } from './pages/servicios/servicio-detail/servicio-detail';
import { ServicioAdminList } from './pages/servicios/servicio-admin-list/servicio-admin-list';
import { ServicioCreatePage } from './pages/servicios/servicio-create-page/servicio-create-page';
import { ServicioEditPage } from './pages/servicios/servicio-edit-page/servicio-edit-page';
import { ProfesionalAdminList } from './pages/profesionales/profesional-admin-list/profesional-admin-list';
import { ProfesionalCreatePage } from './pages/profesionales/profesional-create-page/profesional-create-page';
import { ProfesionalEditPage } from './pages/profesionales/profesional-edit-page/profesional-edit-page';
import { ProfesionalDetail } from './pages/profesionales/profesional-detail/profesional-detail';
import { CitaPage } from './pages/citas/cita-page/cita-page';
import { CitaDetail } from './pages/citas/cita-detail/cita-detail';
import { CitaCreatePage } from './pages/citas/cita-create-page/cita-create-page';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriaAdminList } from './pages/categorias/categoria-admin-list/categoria-admin-list';
import { EspecialidadAdminList } from './pages/especialidades/especialidad-admin-list/especialidad-admin-list';
import { Profile } from './pages/profile/profile';
import { Role } from './core/models/role.model';
import { NoAuthorization } from './pages/auth/no-authorization/no-authorization';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Login } from './pages/usuarios/login/login';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [

            // =========================
            // RUTAS PÚBLICAS
            // =========================

            {
                path: '',
                component: Home,
                title: 'Inicio'
            },

            {
                path: 'servicios',
                component: ServiciosList,
                title: 'Catálogo de servicios'
            },

            {
                path: 'servicios/:id',
                component: ServicioDetail,
                title: 'Detalle del servicio'
            },

            {
                path: 'profesionales/:id',
                component: ProfesionalDetail,
                title: 'Detalle del profesional'
            },

            // =========================
            // AUTENTICACIÓN
            // =========================

            {
                path: 'login',
                component: Login,


                title: 'Iniciar sesión'
            },

            {
                path: 'sin-autorizacion',
                component: NoAuthorization,
                title: 'No autorizado'
            },

            // =========================
            // RUTAS AUTENTICADAS
            // =========================

            {
                path: 'citas',
                component: CitaPage,
                title: 'Mis citas',
                canActivate: [authGuard],
            },

            {
                path: 'perfil',
                component: Profile,
                title: 'Mi perfil',
                canActivate: [authGuard],
            },

            // =========================
            // ADMIN - SERVICIOS
            // =========================

            {
                path: 'admin/servicios',
                component: ServicioAdminList,
                title: 'Mantenimiento de servicios',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            {
                path: 'admin/servicios/crear',
                component: ServicioCreatePage,
                title: 'Registrar servicio',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            {
                path: 'admin/servicios/editar/:id',
                component: ServicioEditPage,
                title: 'Editar servicio',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            // =========================
            // ADMIN - PROFESIONALES
            // =========================

            {
                path: 'admin/profesionales',
                component: ProfesionalAdminList,
                title: 'Mantenimiento de profesionales',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            {
                path: 'admin/profesionales/crear',
                component: ProfesionalCreatePage,
                title: 'Registrar profesional',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            {
                path: 'admin/profesionales/editar/:id',
                component: ProfesionalEditPage,
                title: 'Editar profesional',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            // =========================
            // ADMIN - CITAS
            // =========================

            {
                path: 'admin/citas',
                component: CitaPage,
                title: 'Gestión de citas',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            {
                path: 'admin/citas/crear',
                component: CitaCreatePage,
                title: 'Registrar cita',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            {
                path: 'admin/citas/:id',
                component: CitaDetail,
                title: 'Detalle de cita',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            // =========================
            // ADMIN - USUARIOS
            // =========================

            {
                path: 'admin/usuarios',
                component: UsuariosList,
                title: 'Gestión de usuarios',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            // =========================
            // ADMIN - CATEGORÍAS
            // =========================

            {
                path: 'admin/categorias',
                component: CategoriaAdminList,
                title: 'Mantenimiento de categorías',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },

            // =========================
            // ADMIN - ESPECIALIDADES
            // =========================

            {
                path: 'admin/especialidades',
                component: EspecialidadAdminList,
                title: 'Mantenimiento de especialidades',
                canActivate: [authGuard, roleGuard],
                data: {
                    roles: [Role.ADMIN]
                },
            },
        ],
    },

    // =========================
    // RUTA NO ENCONTRADA
    // =========================

    {
        path: '**',
        redirectTo: '',
    },
];