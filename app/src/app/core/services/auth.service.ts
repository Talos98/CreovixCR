import {
    computed,
    inject,
    Injectable,
    signal,
} from '@angular/core'
import {
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http'
import { Router } from '@angular/router'
import {
    catchError,
    finalize,
    map,
    Observable,
    of,
    shareReplay,
    switchMap,
    tap,
    throwError,
} from 'rxjs'
import { environment } from '../../../environments/environment.development'
import { ApiResponse } from '../models/api-response.model'
import {
    LoginRequest,
    LoginResult,
    RegisterRequest,
    User,
} from '../models/user.model'
import { Role } from '../models/role.model'
import { H } from '@angular/cdk/keycodes'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly htpp = inject(HttpClient)
    private readonly router = inject(Router)
    private readonly apiUrl =
        `${environment.apiUrl}/user`
    private readonly tokenKey = 'access_token'
    private readonly _token = signal<string | null>(
        this.readStorageToken()
    )
    private readonly _user =
        signal<User | null>(null)
    private readonly _loadingSession =
        signal(false)
    private readonly _inicializedSession =
        signal(false)
    private requestCurrentProfile:
        Observable<User | null> | null = null

    readonly token = this._token.asReadonly()
    readonly user = this._user.asReadonly()
    readonly loadingSession =
        this._loadingSession.asReadonly()
    readonly inicializedSession =
        this._inicializedSession.asReadonly()

    readonly authenticated = computed(
        () =>
            this._token() !== null &&
            this._user() !== null
    )

    readonly rol = computed(
        () => this._user()?.role ?? null
    )

    readonly isAdmin = computed(() => {
        const rol = this.rol()
        return rol !== null && rol === Role.ADMIN
    })

    login(
        credentiales: LoginRequest
    ): Observable<User> {
        this._loadingSession.set(true)
        return this.htpp
            .post<ApiResponse<LoginResult>>(
                `${this.apiUrl}/login`,
                credentiales
            )
            .pipe(
                map((response) => {
                    const result = response.data

                    if (!result.token) {
                        throw new Error('El API no devolvió el token de autenticación');

                    }

                    return result
                }),
                tap(({ token }) => {
                    this.saveToken(token)
                }),
                switchMap(() => this.getProfile()),
                tap((user) => {
                    this._user.set(user)
                    this._inicializedSession.set(true)
                }),
                catchError((error: unknown) => {
                    this.cleanSession()
                    return throwError(
                        () =>
                            this.getAuthenticationError(
                                error
                            )
                    )
                }),
                finalize(() => {
                    this._loadingSession.set(false)
                })
            )
    }

    getProfile(): Observable<User> {
        return this.htpp
            .get<ApiResponse<User>>(
                `${this.apiUrl}/profile`
            )
            .pipe(
                map((response) => {
                    const user = response.data
                    if (!user) {
                        throw new Error('El API no devolvió la información del perfil');

                    }
                    return user
                })
            )
    }

    initializeSession(): Observable<User | null> {
        if (this._inicializedSession()) {
            return of(this._user())
        }
        const token = this._token()
        if (!token) {
            this._user.set(null)
            this._inicializedSession.set(true)

            return of(null)
        }

        return this.loadProfile()
    }

    loadProfile(): Observable<User | null> {
        if (this.requestCurrentProfile) {
            return this.requestCurrentProfile
        }

        const token = this._token()
        if (!token) {
            this._user.set(null)
            this._inicializedSession.set(true)

            return of(null)
        }

        this._loadingSession.set(true)
        this.requestCurrentProfile =
            this.getProfile().pipe(
                tap((user) => {
                    this._user.set(user)
                }),
                map(
                    (user): User | null =>
                        user
                ),
                catchError(() => {
                    this.cleanSession()
                    return of(null)
                }),
                finalize(() => {
                    this._loadingSession.set(false)
                    this._inicializedSession.set(true)
                    this.requestCurrentProfile = null
                }),
                shareReplay({
                    bufferSize: 1,
                    refCount: false,
                })
            )
        return this.requestCurrentProfile
    }
    register(
        data: RegisterRequest
    ): Observable<User> {
        return this.htpp
            .post<ApiResponse<User>>(
                `${this.apiUrl}/register`,
                data
            )
            .pipe(
                map((response) => {
                    const user = response.data
                    if (!user) {
                        throw new Error('El API no devolvió usuario registrado')

                    }

                    return user
                })
            )
    }

    logout(redirect = true): void {
        this.cleanSession()
        if (redirect) {
            void this.router.navigate(['/login'])
        }
    }

    hasRol(allowedroles: Role[]): boolean {
        const currentRol = this.rol()

        return (
            currentRol !== null &&
            allowedroles.includes(currentRol)
        )
    }

    getToken(): string | null {
        return this._token()
    }

    private saveToken(token: string): void {
        const cleanToken = token.trim()

        if (!cleanToken) {
            throw new Error('El token recibido no es válido')

        }
        localStorage.setItem(
            this.tokenKey,
            cleanToken
        )
        this._token.set(cleanToken)
    }

    private readStorageToken(): string | null {
        const token =
            localStorage.getItem(this.tokenKey)
        if (!token) {
            return null
        }
        const cleanToken = token.trim()
        return cleanToken.length > 0
            ? cleanToken
            : null
    }

    private cleanSession(): void {
        localStorage.removeItem(this.tokenKey)
        this._token.set(null)
        this._user.set(null)
        this._loadingSession.set(false)
        this._inicializedSession.set(true)
        this.requestCurrentProfile = null
    }

    private getAuthenticationError(
        error: unknown
    ): Error {
        if (!(error instanceof HttpErrorResponse)) {
            return error instanceof Error
                ? error
                : new Error(
                    'No fue posible iniciar sesión'
                )
        }
        if (error.status === 0) {
            return new Error(
                'No fue posible conectarse con el servidor'
            )
        }
        if (error.status === 400) {
            return new Error(
                error.error?.message ??
                'Los datos enviados no son válidos'
            )
        }
        if (error.status === 401) {
            return new Error(
                error.error?.message ??
                'Correo o contraseña incorrectos'
            )
        }
        if (error.status === 403) {
            return new Error(
                error.error?.message ??
                'No tiene permisos para realizar esta acción'
            )
        }
        if (error.status === 404) {
            return new Error(
                error.error?.message ??
                'No fue posible obtener el perfil del usuario'
            )
        }
        return new Error(
            error.error?.message ??
            'Ocurrió un error durante la autenticación'
        )
    }

}


