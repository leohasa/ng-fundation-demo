import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    CardComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <app-card variant="elevated">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-6">
              @if (errorMessage()) {
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p class="text-sm text-red-800">{{ errorMessage() }}</p>
                </div>
              }

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="tu@email.com"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Email válido requerido</p>
                }
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  formControlName="password"
                  placeholder="••••••••"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Contraseña requerida</p>
                }
              </div>

              <app-button
                type="submit"
                [fullWidth]="true"
                [disabled]="loginForm.invalid || authService.loading()"
              >
                {{ authService.loading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </app-button>
            </div>
          </form>
        </app-card>

        <p class="mt-4 text-center text-sm text-gray-600">
          Demo: Usa cualquier email/contraseña para ingresar
        </p>
      </div>
    </div>
  `
})
export class LoginPage {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly errorMessage = signal<string>('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al iniciar sesión');
    }
  }
}
