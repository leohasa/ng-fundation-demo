import { Injectable, signal, computed } from '@angular/core';

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
    // Recuperar token del localStorage al iniciar
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this._token.set(token);
        this._user.set(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStorage();
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this._loading.set(true);
    
    try {
      // Validación mock específica
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
        
        // Persistir en localStorage con flag de admin
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        localStorage.setItem('isAdmin', 'true');
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('isAdmin');
  }

  private simulateApiCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}
