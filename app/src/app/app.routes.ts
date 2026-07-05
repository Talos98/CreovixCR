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
import { CitasList } from './pages/citas/citas-list/citas-list';
import { CitaDetail } from './pages/citas/cita-detail/cita-detail';
import { CitaCreatePage } from './pages/citas/cita-create-page/cita-create-page';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { CategoriaAdminList } from './pages/categorias/categoria-admin-list/categoria-admin-list';
import { EspecialidadAdminList } from './pages/especialidades/especialidad-admin-list/especialidad-admin-list';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            { path: '', component: Home, title: 'Inicio' },
            { path: 'servicios', component: ServiciosList, title: 'Catálogo de servicios' },
            { path: 'servicios/:id', component: ServicioDetail, title: 'Detalle del servicio' },
            { path: 'admin/servicios', component: ServicioAdminList, title: 'Mantenimiento servicios' },
            { path: 'admin/servicios/crear', component: ServicioCreatePage, title: 'Registrar servicio' },
            { path: 'admin/servicios/editar/:id', component: ServicioEditPage, title: 'Editar servicio' },
            { path: 'admin/profesionales', component: ProfesionalAdminList, title: 'Mantenimiento profesionales' },
            { path: 'admin/profesionales/crear', component: ProfesionalCreatePage, title: 'Registrar profesional' },
            { path: 'admin/profesionales/editar/:id', component: ProfesionalEditPage, title: 'Editar profesional' },
            { path: 'profesionales/:id', component: ProfesionalDetail, title: 'Detalle del profesional' },
            { path: 'admin/citas', component: CitasList, title: 'Gestión de citas' },
            { path: 'admin/citas/crear', component: CitaCreatePage, title: 'Registrar cita' },
            { path: 'admin/citas/:id', component: CitaDetail, title: 'Detalle de cita' },
            { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios' },
            { path: 'admin/categorias', component: CategoriaAdminList, title: 'Mantenimiento categorías' },
            { path: 'admin/especialidades', component: EspecialidadAdminList, title: 'Mantenimiento especialidades' },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
