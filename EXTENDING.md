# Guía de Extensión - Ejemplo: Feature "Support"

Esta guía muestra cómo agregar una nueva feature al proyecto siguiendo el patrón Vertical Slice Architecture.

## Ejemplo: Agregar Feature "Support"

Vamos a crear una feature para gestionar información de soporte (usando el modelo SupportInfo).

### Paso 1: Crear Estructura de Carpetas

```bash
mkdir -p src/app/features/support/{components,pages,services}
```

### Paso 2: Crear el Signal Store

**`src/app/features/support/services/support.store.ts`**

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';
import { SupportInfo, CreateSupportInfoDto, UpdateSupportInfoDto } from '../../../core/models';
import { ApiService } from '../../../core/services';

@Injectable({
  providedIn: 'root'
})
export class SupportStore {
  private readonly api = inject(ApiService);

  // State signals
  private readonly _supports = signal<SupportInfo[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly supports = this._supports.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly bankSupports = computed(() => 
    this._supports().filter(s => s.type === 'bank')
  );

  readonly otherSupports = computed(() => 
    this._supports().filter(s => s.type === 'other')
  );

  // Actions
  async loadSupports(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const data = await this.api.get<SupportInfo[]>('/supports');
      this._supports.set(data);
    } catch (error: any) {
      this._error.set(error.message || 'Error al cargar información de soporte');
    } finally {
      this._loading.set(false);
    }
  }

  async createSupport(dto: CreateSupportInfoDto): Promise<void> {
    this._loading.set(true);
    try {
      const newSupport = await this.api.post<SupportInfo>('/supports', dto);
      this._supports.update(supports => [...supports, newSupport]);
    } catch (error: any) {
      this._error.set(error.message);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateSupport(dto: UpdateSupportInfoDto): Promise<void> {
    this._loading.set(true);
    try {
      const updated = await this.api.put<SupportInfo>(`/supports/${dto.id}`, dto);
      this._supports.update(supports => 
        supports.map(s => s.id === dto.id ? updated : s)
      );
    } catch (error: any) {
      this._error.set(error.message);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteSupport(id: string): Promise<void> {
    this._loading.set(true);
    try {
      await this.api.delete(`/supports/${id}`);
      this._supports.update(supports => supports.filter(s => s.id !== id));
    } catch (error: any) {
      this._error.set(error.message);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }
}
```

### Paso 3: Crear Componente de Presentación

**`src/app/features/support/components/support-card.component.ts`**

```typescript
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportInfo } from '../../../core/models';
import { CardComponent, ButtonComponent } from '../../../shared/components';

@Component({
  selector: 'app-support-card',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <app-card variant="elevated">
      <div class="space-y-3">
        <div class="flex items-start justify-between">
          <div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class.bg-blue-100]="support().type === 'bank'"
                  [class.text-blue-800]="support().type === 'bank'"
                  [class.bg-gray-100]="support().type === 'other'"
                  [class.text-gray-800]="support().type === 'other'">
              {{ support().type === 'bank' ? 'Bancario' : 'Otro' }}
            </span>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-gray-900">
          {{ support().title }}
        </h3>

        <p class="text-gray-600 text-sm">
          {{ support().description }}
        </p>

        @if (showActions()) {
          <div class="flex gap-2 pt-2">
            <app-button
              size="sm"
              variant="secondary"
              (clicked)="edit.emit(support())"
            >
              Editar
            </app-button>
            <app-button
              size="sm"
              variant="danger"
              (clicked)="delete.emit(support())"
            >
              Eliminar
            </app-button>
          </div>
        }
      </div>
    </app-card>
  `
})
export class SupportCardComponent {
  support = input.required<SupportInfo>();
  showActions = input<boolean>(false);

  edit = output<SupportInfo>();
  delete = output<SupportInfo>();
}
```

### Paso 4: Crear Página (Smart Component)

**`src/app/features/support/pages/support-list.page.ts`**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportStore } from '../services/support.store';
import { SupportCardComponent } from '../components/support-card.component';
import { ButtonComponent } from '../../../shared/components';

@Component({
  selector: 'app-support-list',
  standalone: true,
  imports: [CommonModule, SupportCardComponent, ButtonComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Información de Soporte</h1>
          <p class="mt-2 text-sm text-gray-600">
            Opciones de apoyo disponibles
          </p>
        </div>
      </div>

      @if (store.loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (store.error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-800">{{ store.error() }}</p>
        </div>
      }

      @if (!store.loading()) {
        <!-- Soportes Bancarios -->
        @if (store.bankSupports().length > 0) {
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Información Bancaria</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (support of store.bankSupports(); track support.id) {
                <app-support-card [support]="support" />
              }
            </div>
          </div>
        }

        <!-- Otros Soportes -->
        @if (store.otherSupports().length > 0) {
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Otras Formas de Apoyo</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (support of store.otherSupports(); track support.id) {
                <app-support-card [support]="support" />
              }
            </div>
          </div>
        }
      }
    </div>
  `
})
export class SupportListPage implements OnInit {
  readonly store = inject(SupportStore);

  ngOnInit(): void {
    this.store.loadSupports();
  }
}
```

### Paso 5: Definir Rutas

**`src/app/features/support/support.routes.ts`**

```typescript
import { Routes } from '@angular/router';

export const SUPPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/support-list.page').then(m => m.SupportListPage)
  }
];
```

### Paso 6: Registrar en App Routes

**`src/app/app.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  // ... rutas existentes
  {
    path: 'support',
    loadChildren: () => import('./features/support/support.routes').then(m => m.SUPPORT_ROUTES)
  },
  // ...
];
```

### Paso 7: Agregar Link en Navegación

Actualizar el componente de navegación o home para incluir link a support:

```typescript
<app-button [routerLink]="['/support']">
  Ver Soporte
</app-button>
```

## Checklist para Nueva Feature

- [ ] Crear estructura de carpetas (`components/`, `pages/`, `services/`)
- [ ] Crear Signal Store con patrón establecido
- [ ] Crear componentes de presentación (dumb components)
- [ ] Crear páginas (smart components)
- [ ] Definir rutas con lazy loading
- [ ] Registrar en app.routes.ts
- [ ] Agregar links de navegación
- [ ] Agregar guards si es necesario
- [ ] Crear tests (opcional pero recomendado)

## Patrones a Seguir

### 1. Signal Store
- Signals privados mutables con `_` prefix
- Exponer versiones readonly
- Usar `computed()` para valores derivados
- Métodos async para acciones

### 2. Components
- Usar `input()` y `output()` signals
- Standalone: true
- Importar solo lo necesario
- Dumb components sin lógica compleja

### 3. Pages
- Inyectar stores
- OnInit para cargar datos
- Conectar store con template
- Manejar loading/error states

### 4. Naming
- Components: `feature-name.component.ts`
- Pages: `feature-name.page.ts`
- Stores: `feature-name.store.ts`
- Routes: `feature-name.routes.ts`

## Ejemplo Completo en el Proyecto

Revisa `src/app/features/projects` para un ejemplo completo con:
- CRUD completo
- Formularios
- Modal de confirmación
- Manejo de errores
- Loading states
- Computed values
- Múltiples páginas

---

Siguiendo este patrón, puedes agregar features de forma consistente y escalable.
