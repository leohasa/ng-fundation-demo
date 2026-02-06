import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Bienvenido a Foundation Demo
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Una arquitectura moderna de Angular 20 con Vertical Slice Architecture
            y manejo de estado basado en Signals
          </p>
          <div class="flex gap-4 justify-center">
            <app-button
              size="lg"
              [routerLink]="['/projects']"
            >
              Ver Proyectos
            </app-button>
            <app-button
              variant="secondary"
              size="lg"
              [routerLink]="['/login']"
            >
              Iniciar Sesión
            </app-button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <app-card variant="elevated">
            <div class="text-center">
              <div class="mx-auto h-12 w-12 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Signals-based State
              </h3>
              <p class="text-gray-600">
                Manejo de estado moderno y reactivo usando Angular Signals
              </p>
            </div>
          </app-card>

          <app-card variant="elevated">
            <div class="text-center">
              <div class="mx-auto h-12 w-12 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Vertical Slices
              </h3>
              <p class="text-gray-600">
                Arquitectura modular que organiza el código por funcionalidad
              </p>
            </div>
          </app-card>

          <app-card variant="elevated">
            <div class="text-center">
              <div class="mx-auto h-12 w-12 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Tailwind CSS
              </h3>
              <p class="text-gray-600">
                Diseño moderno y responsivo con clases utilitarias
              </p>
            </div>
          </app-card>
        </div>
      </section>
    </div>
  `
})
export class HomePage {}
