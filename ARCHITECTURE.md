# Arquitectura del Proyecto

## Visión General

Este proyecto implementa **Vertical Slice Architecture** con Angular 20, utilizando **Signals** para el manejo de estado y siguiendo los principios modernos de desarrollo Angular.

## Principios Fundamentales

### 1. Vertical Slice Architecture

Cada feature es una "rebanada vertical" completa que contiene toda la funcionalidad necesaria:

```
features/[feature-name]/
├── components/     # Componentes de UI específicos
├── pages/          # Smart components (rutas)
├── services/       # Signal Stores y lógica de negocio
├── models/         # Interfaces locales (opcional)
└── [feature].routes.ts
```

**Ventajas:**
- Alta cohesión: todo lo relacionado está junto
- Bajo acoplamiento: features independientes
- Fácil de entender y mantener
- Escalable: agregar features no afecta las existentes

### 2. Signals-based State Management

Uso de Angular Signals para manejo de estado reactivo:

```typescript
// Signal Store Pattern
@Injectable({ providedIn: 'root' })
export class FeatureStore {
  // Estado privado mutable
  private readonly _data = signal<Data[]>([]);
  
  // Exposición pública readonly
  readonly data = this._data.asReadonly();
  
  // Valores computados
  readonly activeData = computed(() => 
    this._data().filter(d => d.isActive)
  );
  
  // Acciones
  async loadData(): Promise<void> {
    const result = await this.api.get('/data');
    this._data.set(result);
  }
}
```

**Por qué Signals:**
- Más simple que RxJS para estado local
- Mejor rendimiento (fine-grained reactivity)
- API más intuitiva
- Menos código boilerplate

### 3. Standalone Components

100% standalone, sin NgModules:

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, SharedComponent],
  // ...
})
export class FeatureComponent {}
```

### 4. Functional Providers

Guards e Interceptores como funciones:

```typescript
// Guard funcional
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};

// Interceptor funcional
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  // ...
  return next(req);
};
```

## Estructura de Carpetas

### `/core` - Servicios Singleton

Contiene lógica compartida en toda la aplicación:

- **models/**: Interfaces y tipos globales
- **services/**: Servicios singleton (auth, api, config)
- **guards/**: Guards funcionales de navegación
- **interceptors/**: Interceptores HTTP funcionales

**Reglas:**
- Todos los servicios son `providedIn: 'root'`
- No debe contener componentes
- Solo lógica que realmente es global

### `/shared` - UI Components Reutilizables

Componentes, pipes y directivas sin lógica de negocio:

- **components/**: Button, Input, Modal, Card, etc.
- **pipes/**: TimeAgo, Currency, etc.
- **directives/**: Directivas de atributo reutilizables

**Reglas:**
- Componentes tontos (dumb components)
- Solo reciben datos por @Input
- Emiten eventos por @Output
- No conocen el dominio de negocio

### `/features` - Vertical Slices

Cada feature es autónoma:

```
features/
├── projects/
│   ├── components/          # UI específico de projects
│   │   ├── project-card.component.ts
│   │   └── project-form.component.ts
│   ├── pages/               # Rutas
│   │   ├── projects-list.page.ts
│   │   └── project-detail.page.ts
│   ├── services/            # Estado y lógica
│   │   └── projects.store.ts
│   └── projects.routes.ts   # Rutas lazy-loaded
├── auth/
│   ├── pages/
│   │   └── login.page.ts
│   └── auth.routes.ts
└── admin/
    ├── pages/
    │   └── admin-dashboard.page.ts
    └── admin.routes.ts
```

**Convenciones:**
- **Components**: Presentación, sin lógica compleja
- **Pages**: Smart components, conectan Store con UI
- **Services**: Signal Stores, API calls, lógica de negocio
- **Routes**: Lazy loading por feature

## Flujo de Datos

### 1. Signal Store Pattern

```typescript
// 1. Store define el estado
private readonly _items = signal<Item[]>([]);
readonly items = this._items.asReadonly();
readonly activeItems = computed(() => this._items().filter(i => i.active));

// 2. Page/Component inyecta el store
readonly store = inject(ItemsStore);

// 3. Template consume signals directamente
{{ store.activeItems().length }}
@for (item of store.items(); track item.id) { ... }

// 4. Acciones modifican el estado
async addItem(item: Item) {
  await this.api.post('/items', item);
  this._items.update(items => [...items, item]);
}
```

### 2. Componentes de Presentación

```typescript
@Component({
  selector: 'app-item-card',
  standalone: true,
  template: `
    <div (click)="clicked.emit(item())">
      {{ item().title }}
    </div>
  `
})
export class ItemCardComponent {
  item = input.required<Item>();      // Signal input
  clicked = output<Item>();           // Signal output
}
```

### 3. Reactive Forms

Para formularios, usamos Reactive Forms:

```typescript
form = this.fb.group({
  title: ['', Validators.required],
  description: ['']
});

onSubmit() {
  if (this.form.valid) {
    this.submitted.emit(this.form.value);
  }
}
```

## Patrones de Diseño

### 1. Smart vs Dumb Components

**Smart (Pages):**
- Inyectan servicios/stores
- Manejan lógica de negocio
- Conectan datos con UI
- Sufijo: `.page.ts`

**Dumb (Components):**
- Solo @Input y @Output
- UI pura
- Reutilizables
- Sufijo: `.component.ts`

### 2. Signal Store

```typescript
@Injectable({ providedIn: 'root' })
export class EntityStore {
  // Private mutable signals
  private readonly _entities = signal<Entity[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  
  // Public readonly
  readonly entities = this._entities.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed
  readonly activeEntities = computed(() => 
    this._entities().filter(e => e.isActive)
  );
  
  // Actions
  async load() {
    this._loading.set(true);
    try {
      const data = await this.api.get('/entities');
      this._entities.set(data);
    } catch (e) {
      this._error.set(e.message);
    } finally {
      this._loading.set(false);
    }
  }
}
```

### 3. Lazy Loading por Feature

```typescript
// app.routes.ts
{
  path: 'projects',
  loadChildren: () => 
    import('./features/projects/projects.routes')
      .then(m => m.PROJECTS_ROUTES)
}

// projects.routes.ts
export const PROJECTS_ROUTES: Routes = [
  { path: '', component: ProjectsListPage },
  { path: ':id', component: ProjectDetailPage }
];
```

## Mejores Prácticas

### 1. Naming Conventions

- **Components**: `feature-name.component.ts`
- **Pages**: `feature-name.page.ts`
- **Services**: `feature-name.service.ts`
- **Stores**: `feature-name.store.ts`
- **Guards**: `feature.guard.ts`
- **Interceptors**: `feature.interceptor.ts`

### 2. Organización de Imports

```typescript
// 1. Angular core
import { Component, signal } from '@angular/core';

// 2. Angular common
import { CommonModule } from '@angular/common';

// 3. RxJS (solo si es necesario)
import { map, filter } from 'rxjs';

// 4. Core
import { AuthService } from '@core/services';

// 5. Shared
import { ButtonComponent } from '@shared/components';

// 6. Feature local
import { ProjectStore } from '../services';
```

### 3. Signal Input/Output

Usar la nueva API de signals para inputs/outputs:

```typescript
// Antes (Angular <19)
@Input() title: string = '';
@Output() clicked = new EventEmitter<void>();

// Ahora (Angular 20+)
title = input<string>('');
clicked = output<void>();
```

### 4. Computed vs Method

```typescript
// ❌ Evitar: se ejecuta en cada change detection
get fullName() {
  return `${this.firstName} ${this.lastName}`;
}

// ✅ Mejor: solo se recalcula cuando cambian las dependencias
fullName = computed(() => 
  `${this.firstName()} ${this.lastName()}`
);
```

## Testing

### Unit Tests

```typescript
describe('ProjectsStore', () => {
  let store: ProjectsStore;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ProjectsStore);
  });
  
  it('should load projects', async () => {
    await store.loadProjects();
    expect(store.projects().length).toBeGreaterThan(0);
  });
});
```

## Extensión del Sistema

### Agregar Nueva Feature

1. Crear estructura:
```bash
mkdir -p src/app/features/nueva-feature/{components,pages,services}
```

2. Crear Store:
```typescript
@Injectable({ providedIn: 'root' })
export class NuevaFeatureStore {
  // Implementar patrón Signal Store
}
```

3. Crear Pages y Components

4. Definir rutas:
```typescript
// nueva-feature.routes.ts
export const NUEVA_FEATURE_ROUTES: Routes = [
  { path: '', component: NuevaFeaturePage }
];
```

5. Agregar al app.routes.ts:
```typescript
{
  path: 'nueva-feature',
  loadChildren: () => import('./features/nueva-feature/nueva-feature.routes')
}
```

## Referencias

- [Angular Signals](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
