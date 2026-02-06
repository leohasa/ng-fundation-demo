import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { ErrorHandlerService } from './error-handler.service';
import { AUTH_STORAGE_KEYS } from '../constants/storage.constants';
import { AuthenticationError, ValidationError } from '../models/error.model';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly errorHandler = inject(ErrorHandlerService);

  // Signals para manejo de estado
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _loading = signal<boolean>(false);

  // Computed signals
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => 
    this._user()?.roles.includes('admin') ?? false
  );

  constructor() {
    // Recuperar token del storage al iniciar
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const token = this.storage.get<string>(AUTH_STORAGE_KEYS.TOKEN);
      const user = this.storage.get<User>(AUTH_STORAGE_KEYS.USER);
      
      if (token && user) {
        this._token.set(token);
        this._user.set(user);
      }
    } catch (error) {
      const appError = this.errorHandler.handle(
        error,
        { component: 'AuthService', action: 'loadFromStorage' }
      );
      this.clearStorage();
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this._loading.set(true);
    
    try {
      // Validar credenciales
      if (!credentials.email || !credentials.password) {
        throw new ValidationError('Email y contraseña son requeridos');
      }

      // Simular llamada a API
      await this.simulateApiCall();
      
      // Validar credenciales mock
      if (credentials.email === 'admin@fundacion.org' && credentials.password === 'admin123') {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Administrador',
          roles: ['admin']
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        this._user.set(mockUser);
        this._token.set(mockToken);
        
        // Persistir en storage
        this.storage.set(AUTH_STORAGE_KEYS.TOKEN, mockToken);
        this.storage.set(AUTH_STORAGE_KEYS.USER, mockUser);
        this.storage.set(AUTH_STORAGE_KEYS.IS_ADMIN, 'true');
      } else {
        throw new AuthenticationError('Credenciales inválidas');
      }
    } catch (error) {
      const appError = this.errorHandler.handle(
        error,
        { component: 'AuthService', action: 'login', metadata: { email: credentials.email } }
      );
      throw appError;
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
    this.clearStorage();
  }

  private clearStorage(): void {
    this.storage.remove(AUTH_STORAGE_KEYS.TOKEN);
    this.storage.remove(AUTH_STORAGE_KEYS.USER);
    this.storage.remove(AUTH_STORAGE_KEYS.IS_ADMIN);
  }

  private simulateApiCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}
