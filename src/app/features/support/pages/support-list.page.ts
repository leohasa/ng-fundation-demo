import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportStore } from '../services/support.store';
import { SupportCardComponent } from '../components/support-card.component';

@Component({
  selector: 'app-support-list',
  standalone: true,
  imports: [CommonModule, SupportCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Cómo Apoyarnos
          </h1>
          <p class="text-lg text-gray-600">
            Tu apoyo nos ayuda a continuar con nuestra misión. Elige la forma que más te convenga.
          </p>
        </div>

        <!-- Loading State -->
        @if (store.loading()) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Cargando información...</p>
          </div>
        }

        <!-- Error State -->
        @if (store.error()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">{{ store.error() }}</p>
          </div>
        }

        <!-- Content -->
        @if (!store.loading() && !store.error()) {
          <!-- Bank Support Section -->
          @if (store.hasBankSupport()) {
            <section class="mb-12">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                Cuentas Bancarias
              </h2>
              <p class="text-gray-600 mb-6">
                Puedes realizar transferencias directas a nuestras cuentas bancarias.
              </p>
              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                @for (info of store.bankSupport(); track info.id) {
                  <app-support-card [supportInfo]="info" />
                }
              </div>
            </section>
          }

          <!-- Other Support Section -->
          @if (store.hasOtherSupport()) {
            <section>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                Otras Formas de Apoyo
              </h2>
              <p class="text-gray-600 mb-6">
                También aceptamos donaciones a través de estas plataformas.
              </p>
              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                @for (info of store.otherSupport(); track info.id) {
                  <app-support-card [supportInfo]="info" />
                }
              </div>
            </section>
          }

          <!-- Empty State -->
          @if (store.supportInfo().length === 0) {
            <div class="text-center py-12">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                No hay información de apoyo disponible
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Actualmente no tenemos formas de apoyo configuradas.
              </p>
            </div>
          }
        }

        <!-- Contact Section -->
        <div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">
            ¿Necesitas ayuda?
          </h3>
          <p class="text-blue-800">
            Si tienes preguntas sobre cómo apoyarnos o necesitas información adicional, 
            no dudes en contactarnos. Estamos aquí para ayudarte.
          </p>
        </div>
      </div>
    </div>
  `
})
export class SupportListPage implements OnInit {
  readonly store = inject(SupportStore);

  ngOnInit(): void {
    this.store.loadSupportInfo();
  }
}
